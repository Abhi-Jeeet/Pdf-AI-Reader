import React, { useState } from 'react';
import PDFUpload from './components/PDFUpload';
import QuestionForm from './components/QuestionForm';

function App() {
  const [documentId, setDocumentId] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [fileName, setFileName] = useState(null);

  const handleUploadSuccess = (docId, name) => {
    setDocumentId(docId);
    setFileName(name);
    setAnswer(null); // Clear previous answers
  };

  return (
    <div className="App" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>PDF Q&A System</h1>
      
      {!documentId ? (
        <div>
          <h2>Upload a PDF</h2>
          <PDFUpload onUploadSuccess={handleUploadSuccess} />
        </div>
      ) : (
        <div>
          <h2>Ask Questions</h2>
          {fileName && <p>Current document: {fileName}</p>}
          <QuestionForm documentId={documentId} onAnswer={setAnswer} />
          
          {answer && (
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
              <h3>Answer:</h3>
              <p style={{ whiteSpace: 'pre-wrap' }}>{answer}</p>
            </div>
          )}
          
          <button 
            onClick={() => {
              setDocumentId(null);
              setFileName(null);
              setAnswer(null);
            }}
            style={{ marginTop: '20px' }}
          >
            Upload Different PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default App;