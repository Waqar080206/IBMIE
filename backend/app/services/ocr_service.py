# app/services/ocr_service.py
import io
import pypdf
import pytesseract
from pdf2image import convert_from_bytes

class OCRService:
    @staticmethod
    async def extract_text(file_bytes: bytes) -> str:
        """
        Extracts text from a PDF (digital or scanned).
        Optimized for memory and speed.
        """
        text = ""
        try:
            # Try fast native text parsing first
            pdf_file = io.BytesIO(file_bytes)
            reader = pypdf.PdfReader(pdf_file)
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        except Exception:
            pass

        # If native extraction yields almost nothing, it's a scan/photo -> Run OCR
        if len(text.strip()) < 50:
            text = OCRService._run_ocr(file_bytes)
            
        return text

    @staticmethod
    def _run_ocr(file_bytes: bytes) -> str:
        ocr_text = ""
        try:
            # dpi=150 saves massive amounts of RAM and cuts processing speed in half
            images = convert_from_bytes(file_bytes, dpi=150)
            for i, image in enumerate(images):
                page_text = pytesseract.image_to_string(image)
                ocr_text += f"\n--- Page {i+1} ---\n" + page_text
        except Exception as e:
            print(f"OCR Critical Failure: {str(e)}")
            return ""
        return ocr_text