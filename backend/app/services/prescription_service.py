from __future__ import annotations

from math import ceil
from pathlib import Path
from uuid import UUID, uuid4

from fastapi import UploadFile
from sqlalchemy import func, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.exceptions import DatabaseOperationError, InvalidPDFError, ReportNotFoundError
from app.core.logging import get_logger
from app.core.security import validate_pdf_upload
from app.database.models import Medication, Prescription
from app.schemas.prescription import (
    PrescriptionDeleteResponse,
    PrescriptionDetailResponse,
    PrescriptionListItem,
    PrescriptionListResponse,
    PrescriptionRead,
    PrescriptionUploadResponse,
)
from app.schemas.responses import PaginationMeta
from app.services.parser_service import ParserService
from app.utils.files import sanitize_filename

LOGGER = get_logger(__name__)


class PrescriptionService:
    def __init__(
        self,
        session: AsyncSession,
        parser_service: ParserService | None = None,
    ) -> None:
        self.session = session
        self.parser_service = parser_service or ParserService()
        self.settings = get_settings()

    async def upload_prescription(
        self,
        upload_file: UploadFile,
        user_id: UUID | None = None,
    ) -> PrescriptionUploadResponse:
        await validate_pdf_upload(upload_file)

        prescription_id = uuid4()
        original_filename = sanitize_filename(upload_file.filename or "prescription.pdf")
        storage_path = f"db-only/prescriptions/{prescription_id}/{original_filename}"
        temp_path: Path | None = None

        try:
            temp_path = await self._save_upload_to_tempfile(upload_file, original_filename)
            
            # FIXED: Explicitly passing doc_type="prescription" ensures Groq prompts 
            # and model validation load the prescription extraction schemas accurately.
            parsed_data = await self.parser_service.parse_pdf(temp_path, doc_type="prescription")
            
            prescription = Prescription(
                id=prescription_id,
                user_id=user_id,
                original_filename=original_filename,
                storage_path=storage_path,
                doctor_name=getattr(parsed_data, "doctor_name", None),
                clinic_name=getattr(parsed_data, "clinic_name", None),
                date=getattr(parsed_data, "date", None),
                follow_up_interval=getattr(parsed_data, "follow_up_interval", None),
            )

            medications_list = getattr(parsed_data, "medications", []) or []
            for med in medications_list:
                is_dict = isinstance(med, dict)
                medication_row = Medication(
                    id=uuid4(),
                    name=med.get("name") if is_dict else getattr(med, "name", "Unknown Medication"),
                    dosage=med.get("dosage") if is_dict else getattr(med, "dosage", None),
                    frequency=med.get("frequency") if is_dict else getattr(med, "frequency", None),
                    duration=med.get("duration") if is_dict else getattr(med, "duration", None),
                    instructions=med.get("instructions") if is_dict else getattr(med, "instructions", None),
                )
                prescription.medications.append(medication_row)

            self.session.add(prescription)
            await self.session.commit()
            
            # Populate relationships for clean serialization
            await self.session.refresh(prescription, attribute_names=["medications"])

            LOGGER.info(
                "Stored normalized prescription data in PostgreSQL",
                extra={"prescription_id": str(prescription.id), "storage_path": prescription.storage_path},
            )
            return PrescriptionUploadResponse(
                message="Prescription uploaded successfully",
                prescription=self._to_schema(prescription, PrescriptionRead),
            )
        except Exception as exc:
            await self.session.rollback()
            if hasattr(exc, "status_code"):
                raise
            if isinstance(exc, SQLAlchemyError):
                raise DatabaseOperationError(str(exc)) from exc
            raise
        finally:
            if temp_path is not None:
                self._cleanup_tempfile(temp_path)

    async def get_prescription(self, prescription_id: UUID) -> PrescriptionDetailResponse:
        prescription = await self._fetch_prescription_or_404(prescription_id)
        return PrescriptionDetailResponse(
            message="Prescription retrieved successfully",
            prescription=self._to_schema(prescription, PrescriptionRead),
        )

    async def list_prescriptions(self, page: int = 1, page_size: int = 20) -> PrescriptionListResponse:
        offset = (page - 1) * page_size
        total_statement = select(func.count()).select_from(Prescription)
        total = int((await self.session.execute(total_statement)).scalar_one())

        statement = (
            select(Prescription)
            .order_by(Prescription.uploaded_at.desc())
            .offset(offset)
            .limit(page_size)
        )
        rows = (await self.session.execute(statement)).scalars().all()
        total_pages = ceil(total / page_size) if total else 0

        return PrescriptionListResponse(
            items=[self._to_schema(p, PrescriptionListItem) for p in rows],
            pagination=PaginationMeta(
                page=page,
                page_size=page_size,
                total=total,
                total_pages=total_pages,
            ),
        )

    async def delete_prescription(self, prescription_id: UUID) -> PrescriptionDeleteResponse:
        prescription = await self._fetch_prescription_or_404(prescription_id)
        try:
            await self.session.delete(prescription)
            await self.session.commit()
        except SQLAlchemyError as exc:
            await self.session.rollback()
            raise DatabaseOperationError(str(exc)) from exc

        return PrescriptionDeleteResponse(
            message="Prescription deleted successfully",
            prescription_id=prescription_id,
        )

    async def _fetch_prescription_or_404(self, prescription_id: UUID) -> Prescription:
        statement = select(Prescription).where(Prescription.id == prescription_id)
        prescription = (await self.session.execute(statement)).scalar_one_or_none()
        if prescription is None:
            raise ReportNotFoundError("Prescription not found")
        
        await self.session.refresh(prescription, attribute_names=["medications"])
        return prescription

    def _to_schema(
        self,
        prescription: Prescription,
        schema_type: type[PrescriptionRead] | type[PrescriptionListItem],
    ) -> PrescriptionRead | PrescriptionListItem:
        return schema_type.model_validate(prescription, from_attributes=True)

    async def _save_upload_to_tempfile(self, upload_file: UploadFile, original_filename: str) -> Path:
        self.settings.uploads_dir.mkdir(parents=True, exist_ok=True)
        suffix = Path(original_filename).suffix or ".pdf"
        temp_path = self.settings.uploads_dir / f"{uuid4()}{suffix}"
        max_bytes = self.settings.max_upload_size_mb * 1024 * 1024
        bytes_written = 0

        try:
            with temp_path.open("wb") as temp_handle:
                while chunk := await upload_file.read(1024 * 1024):
                    bytes_written += len(chunk)
                    if bytes_written > max_bytes:
                        raise InvalidPDFError(
                            f"Uploaded file exceeds maximum size of {self.settings.max_upload_size_mb} MB"
                        )
                    temp_handle.write(chunk)
        except Exception:
            if temp_path.exists():
                temp_path.unlink()
            raise
        finally:
            await upload_file.seek(0)

        return temp_path

    def _cleanup_tempfile(self, temp_path: Path) -> None:
        try:
            if temp_path.exists():
                temp_path.unlink()
        except OSError as exc:
            LOGGER.warning(
                "Failed to delete temporary PDF",
                extra={"temp_path": str(temp_path), "error": str(exc)},
            )