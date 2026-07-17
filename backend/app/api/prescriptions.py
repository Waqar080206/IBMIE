from uuid import UUID
from fastapi import APIRouter, Depends, UploadFile, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.database import get_db_session
from backend.app.schemas.prescription import (
    PrescriptionDeleteResponse,
    PrescriptionDetailResponse,
    PrescriptionListResponse,
    PrescriptionUploadResponse,
)
from app.services.prescription_service import PrescriptionService

router = APIRouter(prefix="/prescriptions", tags=["Prescriptions"])


@router.post("", response_model=PrescriptionUploadResponse)
async def upload_prescription(
    file: UploadFile,
    user_id: UUID | None = None,
    session: AsyncSession = Depends(get_db_session),
):
    service = PrescriptionService(session)
    return await service.upload_prescription(file, user_id=user_id)


@router.get("/{prescription_id}", response_model=PrescriptionDetailResponse)
async def get_prescription(
    prescription_id: UUID,
    session: AsyncSession = Depends(get_db_session),
):
    service = PrescriptionService(session)
    return await service.get_prescription(prescription_id)


@router.get("", response_model=PrescriptionListResponse)
async def list_prescriptions(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    session: AsyncSession = Depends(get_db_session),
):
    service = PrescriptionService(session)
    return await service.list_prescriptions(page=page, page_size=page_size)


@router.delete("/{prescription_id}", response_model=PrescriptionDeleteResponse)
async def delete_prescription(
    prescription_id: UUID,
    session: AsyncSession = Depends(get_db_session),
):
    service = PrescriptionService(session)
    return await service.delete_prescription(prescription_id)