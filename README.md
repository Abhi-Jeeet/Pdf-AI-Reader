# PDF AI READER(Revolutionizing PDF Interaction with llama3.2!)

This application allows users to upload PDF files, extract text from them, and ask questions about the content. The backend processes the uploaded PDF files, handles text extraction, chunking, and question answering using large language models (LLMs). The frontend provides a user-friendly interface for interacting with the backend services.

## Architecture Overview

### Backend Architecture

The backend is built with **FastAPI** (Python 3.10) and handles PDF processing and question answering.

#### Key Backend Components

1. **FastAPI Application (`app.py`)**
   - **Role**: Main entry point for the backend service.
   - **Responsibilities**:
     - Initializes and configures FastAPI.
     - Sets up CORS for secure frontend-backend interaction.
     - Defines API endpoints (`/upload`, `/ask`, `/test`).
     - Maintains an in-memory dictionary of PDF processors for each uploaded PDF.

2. **PDF Processor (`pdf_processor.py`)**
   - **Role**: Core class for handling PDF text extraction, chunking, and vectorization.
   - **Responsibilities**:
     - **Text Extraction**: Uses PyMuPDF (fitz) to extract text from PDFs.
     - **Chunking Text**: Splits text into smaller chunks for efficient querying.
     - **Vectorization**: Uses FAISS to store and search vectorized text chunks.
     - **Question Answering**: Integrates LangChain and Ollama to generate answers from the PDF content.

3. **API Endpoints (`app.py`)**
   - **`/upload`**: Accepts PDF files and initializes a PDF processor.
   - **`/ask`**: Accepts questions, performs a vector search, and generates an answer using the LLM.
   - **`/test`**: Simple health check or CORS verification endpoint.

#### Backend Interaction Flow
1. **File Upload Flow**:
   - User uploads a PDF via the `/upload` endpoint.
   - Text is extracted, chunked, and stored in a vector store (FAISS).
   - Frontend updates UI with success/error response.

2. **Question-Answer Flow**:
   - User submits a question via the frontend.
   - The backend processes the question by performing a vector search, then using LangChain/Ollama to return an answer.
   - Frontend updates UI with the generated response.

### Frontend Architecture

The frontend is built with **React** and handles user interactions, making API calls, and displaying results.

#### Key Frontend Components

1. **App Component (`App.jsx`)**
   - **Role**: Container for the application layout.
   - **Responsibilities**:
     - Manages global state (file upload status, questions/answers).
     - Organizes layout with header and content sections.

2. **File Upload Component (`FileUpload.jsx`)**
   - **Role**: Manages the file upload process.
   - **Responsibilities**:
     - Allows users to select and upload a PDF file.
     - Sends the file to the backend’s `/upload` endpoint using Axios.
     - Manages upload state (loading, success, error).

3. **Question Section Component (`QuestionSection.jsx`)**
   - **Role**: Handles the Q&A interface.
   - **Responsibilities**:
     - Provides an input field for users to submit questions.
     - Sends questions to the backend’s `/ask` endpoint.
     - Displays the answer in a chat-like interface.

#### Data Flow
1. **PDF Upload Flow**:
   - User → `FileUpload` → Backend `/upload` → PDF Processor Initialization → Response → UI Update

2. **Question-Answer Flow**:
   - User → `QuestionSection` → Backend `/ask` → PDF Processor → Vector Search → LLM Processing → Response → UI Update

### Key Technologies Used

#### Backend
- **FastAPI**: Web framework for building the API.
- **LangChain**: Framework for LLM integration in question answering.
- **Ollama**: Locally-hosted LLM for processing queries.
- **FAISS**: Library for efficient similarity search and vector storage.
- **PyMuPDF (fitz)**: Library for extracting text from PDFs.

#### Frontend
- **React**: JavaScript library for building the user interface.
- **Material-UI**: UI component library for React.
- **Axios**: HTTP client for making requests to the backend.
- **Vite**: Build tool for fast React development.

### State Management
- **Frontend**: React's `useState` hook is used to manage local state (e.g., file upload status and current questions/answers).
- **Backend**: The backend uses an in-memory dictionary (`pdf_processors`) to store references to PDF processors for each uploaded PDF.
