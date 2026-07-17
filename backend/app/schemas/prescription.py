from __future__ import annotations

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.responses import PaginationMeta

# ==========================================
# 1. PARSING / EXTRACTION SCHEMAS (For ParserService)
# ==========================================

class MedicationExtractionSchema(BaseModel):
    name: str = Field(..., description="Name of the medication/drug")
    dosage: str | None = Field(None, description="Dosage (e.g., 500mg, 1 tablet)")
    frequency: str | None = Field(None, description="Frequency (e.g., Once daily, Twice a day, TDS)")
    duration: str | None = Field(None, description="Duration of treatment (e.g., 5 days, 1 month)")
    instructions: str | None = Field(None, description="Special instructions (e.g., Take after food)")


class PrescriptionExtractionSchema(BaseModel):
    doctor_name: str | None = Field(None, description="Name of the physician/doctor")
    clinic_name: str | None = Field(None, description="Name of the clinic or hospital")
    date: str | None = Field(None, description="Date of the prescription")
    follow_up_interval: str | None = Field(None, description="Follow-up timeframe or instructions")
    medications: list[MedicationExtractionSchema] = Field(default_factory=list, description="List of medications prescribed")


# ==========================================
# 2. APPLICATION API SCHEMAS (For Routes & Responses)
# ==========================================

class MedicationRead(BaseModel):
    id: UUID
    name: str
    dosage: str | None = None
    frequency: str | None = None
    duration: str | None = None
    instructions: str | None = None

    model_config = ConfigDict(from_attributes=True)


class PrescriptionRead(BaseModel):
    id: UUID
    user_id: UUID | None
    original_filename: str
    storage_path: str
    uploaded_at: datetime
    
    doctor_name: str | None = None
    clinic_name: str | None = None
    date: str | None = None
    follow_up_interval: str | None = None
    
    medications: list[MedicationRead] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


class PrescriptionListItem(BaseModel):
    id: UUID
    user_id: UUID | None
    original_filename: str
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PrescriptionUploadResponse(BaseModel):
    message: str
    prescription: PrescriptionRead


class PrescriptionDetailResponse(BaseModel):
    message: str
    prescription: PrescriptionRead


class PrescriptionListResponse(BaseModel):
    items: list[PrescriptionListItem]
    pagination: PaginationMeta


class PrescriptionDeleteResponse(BaseModel):
    message: str
    prescription_id: UUID