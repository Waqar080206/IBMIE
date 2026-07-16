from __future__ import annotations

import asyncio
import json
import os
import re
from pathlib import Path
from typing import Any, Literal

import httpx
from pydantic import BaseModel, Field
from pypdf import PdfReader

from app.core.exceptions import ParserServiceError
from app.core.logging import get_logger

LOGGER = get_logger(__name__)
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
GROQ_CHAT_COMPLETIONS_URL = "https://api.groq.com/openai/v1/chat/completions"
SYSTEM_PROMPT = "You extract structured medical lab data with high factual precision and return valid JSON only."


class MedicalMetric(BaseModel):
    biomarker_name: str = Field(
        description="The standardized name of the test or metric (e.g., Hemoglobin, WBC Count, Creatinine)."
    )
    extracted_abbreviation: str | None = Field(
        default=None,
        description="The abbreviation as it appeared in the report, if any (e.g., Hb, Hgb, RBC).",
    )
    value: str = Field(
        description="The exact numerical or qualitative value recorded (e.g., 14.2, Negative, 5.5)."
    )
    unit: str | None = Field(
        default=None,
        description="The measurement unit associated with the value (e.g., g/dL, mg/dL, 10^3/uL).",
    )
    status: Literal["NORMAL", "HIGH", "LOW", "UNSPECIFIED"] = Field(
        description="The clinical status flag relative to standard reference ranges."
    )


class LabReportExtractionSchema(BaseModel):
    patient_demographics_found: bool = Field(
        description="True if patient name or metadata is explicitly present on the document."
    )
    metrics: list[MedicalMetric] = Field(
        description="A comprehensive array containing all medical biomarkers extracted from the lab report pages."
    )


class ParserService:
    async def parse_pdf(self, pdf_path: Path) -> dict[str, Any]:
        return await asyncio.to_thread(self._parse_sync, pdf_path)

    def _parse_sync(self, pdf_path: Path) -> dict[str, Any]:
        try:
            parsed = parse_medical_pdf(pdf_path)
        except Exception as exc:
            raise ParserServiceError(str(exc)) from exc

        return parsed.model_dump()


def extract_pdf_text(pdf_path: str | Path) -> str:
    reader = PdfReader(str(pdf_path))
    pages: list[str] = []

    for page in reader.pages:
        text = page.extract_text() or ""
        if text.strip():
            pages.append(text.strip())

    return "\n\n".join(pages).strip()


def build_prompt(report_text: str) -> str:
    return (
        "You are an expert clinical data parsing engine.\n"
        "Extract only facts that are explicitly present in the document text.\n\n"
        "Rules:\n"
        "- Do not guess, infer, or normalize beyond what is visible in the report.\n"
        "- Preserve the exact measured value as written.\n"
        "- Keep units exactly as shown, or null if no unit is present.\n"
        "- Set status to one of NORMAL, HIGH, LOW, or UNSPECIFIED only.\n"
        "- Return JSON that matches the requested schema exactly.\n\n"
        f"Document text:\n{report_text}"
    )


def call_groq(report_text: str, api_key: str) -> str:
    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": build_prompt(report_text)},
        ],
        "temperature": 0,
        "response_format": {"type": "json_object"},
    }
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    response = httpx.post(
        GROQ_CHAT_COMPLETIONS_URL,
        headers=headers,
        json=payload,
        timeout=120,
    )
    try:
        response.raise_for_status()
    except httpx.HTTPStatusError as exc:
        raise RuntimeError(f"Groq API error {response.status_code}: {response.text}") from exc

    return str(response.json()["choices"][0]["message"]["content"])


def normalize_groq_output(content: str) -> dict[str, Any]:
    raw = json.loads(content)
    if isinstance(raw, list):
        if all(isinstance(item, dict) for item in raw):
            raw = {"tests": raw}
        else:
            raise RuntimeError(f"Groq returned unsupported JSON array: {content}")

    if not isinstance(raw, dict):
        raise RuntimeError(f"Groq returned unsupported JSON value: {content}")

    if isinstance(raw.get("metrics"), list):
        return {
            "patient_demographics_found": bool(raw.get("patient_demographics_found")),
            "metrics": raw["metrics"],
        }

    test_items = raw.get("tests") or raw.get("results") or []
    if not isinstance(test_items, list):
        test_items = []

    metrics: list[dict[str, Any]] = []
    for item in test_items:
        if not isinstance(item, dict):
            continue

        test_name = str(item.get("name") or item.get("test") or item.get("biomarker_name") or "").strip()
        abbreviation = item.get("extracted_abbreviation")
        match = re.match(r"^(.*)\(([^)]+)\)\s*$", test_name)
        if match:
            test_name = match.group(1).strip()
            abbreviation = match.group(2).strip() or None

        status = str(item.get("status") or "UNSPECIFIED").upper()
        if status not in {"NORMAL", "HIGH", "LOW", "UNSPECIFIED"}:
            status = "UNSPECIFIED"

        metrics.append(
            {
                "biomarker_name": test_name,
                "extracted_abbreviation": abbreviation,
                "value": str(item.get("result", item.get("value", ""))),
                "unit": item.get("unit"),
                "status": status,
            }
        )

    return {
        "patient_demographics_found": bool(raw.get("patient")),
        "metrics": metrics,
    }


def parse_medical_pdf(pdf_path: str | Path) -> LabReportExtractionSchema:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is not set in the environment")

    pdf_file = Path(pdf_path)
    if not pdf_file.exists():
        raise FileNotFoundError(f"PDF file not found: {pdf_path}")

    report_text = extract_pdf_text(pdf_file)
    if not report_text:
        raise ValueError("No readable text was extracted from the PDF")

    content = call_groq(report_text, api_key)
    return LabReportExtractionSchema.model_validate(normalize_groq_output(content))
