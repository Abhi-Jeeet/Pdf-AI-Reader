from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, database
from .services.pdf_service import PDFService
from .services.qa_service import QAService
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Create database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
qa_service = QAService()

class QuestionRequest(BaseModel):
    question: str

@app.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...),
    db: Session = Depends(database.get_db)
):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    filepath = await PDFService.save_pdf(file)
    text_content = PDFService.extract_text(filepath)
    
    doc = models.Document(
        filename=file.filename,
        filepath=filepath,
        content_text=text_content
    )
    db.add(doc)
    db.commit()
    
    return {"document_id": doc.id}

@app.post("/ask/{document_id}")
async def ask_question(
    document_id: int,
    question_request: QuestionRequest,
    db: Session = Depends(database.get_db)
):
    document = db.query(models.Document).filter(models.Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    try:
        vectorstore = qa_service.process_document(document.content_text)
        answer = qa_service.get_answer(vectorstore, question_request.question)
        
        return {"answer": answer}
    except Exception as e:
        print(f"Error processing question: {str(e)}")  # For debugging
        raise HTTPException(status_code=500, detail="Error processing question")
