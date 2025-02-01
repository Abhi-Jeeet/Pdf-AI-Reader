const API_URL = 'http://localhost:8000';

export const uploadPDF = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
};

export const askQuestion = async (documentId, question) => {
  const response = await fetch(`${API_URL}/ask/${documentId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question: question }),
  });
  if (!response.ok) {
    throw new Error('Failed to get answer');
  }
  return response.json();
};