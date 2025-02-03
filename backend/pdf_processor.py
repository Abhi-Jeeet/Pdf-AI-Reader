import fitz
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain_community.llms import Ollama





class PDFProcessor:
    def __init__(self, pdf_path: str):
        self.pdf_path = pdf_path
        self.text = self._extract_text()
        self.vector_store = self._create_vector_store()
        
    def _extract_text(self) -> str:
        """Extract text from PDF file."""
        doc = fitz.open(self.pdf_path)
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    
    def _create_vector_store(self):
        """Create a vector store from the PDF text."""
        # Split text into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
        chunks = text_splitter.split_text(self.text)
        
        # Create embeddings and vector store using Ollama
        embeddings = OllamaEmbeddings(model="llama3.2")  
        vector_store = FAISS.from_texts(chunks, embeddings)
        return vector_store
    
    def ask_question(self, question: str) -> str:
        """Process a question and return an answer based on the PDF content."""
        # Search for relevant documents
        docs = self.vector_store.similarity_search(question)
        
        # Create QA chain with Ollama
        llm = Ollama(model="llama3.2")  
        chain = load_qa_chain(llm, chain_type="stuff")
        
        # Get answer
        answer = chain.run(input_documents=docs, question=question)
        return answer 