from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from pdf_processor import PDFProcessor
from typing import Dict
import shutil

app = FastAPI()

# Configure CORS with both development server ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",    # Create React App default
        "http://localhost:5173",    # Vite default
        "http://127.0.0.1:5173",    # Vite alternative
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Create uploads directory if it doesn't exist
UPLOAD_DIR = "../uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Store PDF processors for each uploaded file
pdf_processors: Dict[str, PDFProcessor] = {}

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Initialize PDF processor for this file
        pdf_processors[file.filename] = PDFProcessor(file_path)
        
        return {"filename": file.filename, "message": "File uploaded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ask")
async def ask_question(filename: str, question: str):
    if filename not in pdf_processors:
        raise HTTPException(status_code=404, detail="File not found")
    
    try:
        processor = pdf_processors[filename]
        answer = processor.ask_question(question)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Add a test endpoint to verify CORS
@app.get("/test")
async def test_endpoint():
    return {"message": "CORS is working"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 