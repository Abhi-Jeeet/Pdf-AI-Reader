import os
from pypdf import PdfReader
from fastapi import UploadFile
from datetime import datetime

UPLOAD_DIR = "uploads"

class PDFService:
    @staticmethod
    async def save_pdf(file: UploadFile):
        if not os.path.exists(UPLOAD_DIR):
            os.makedirs(UPLOAD_DIR)
            
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{file.filename}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        
        with open(filepath, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
        return filepath

    @staticmethod
    def extract_text(filepath: str) -> str:
        reader = PdfReader(filepath)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        return text
