import React, { useState } from 'react';
import { askQuestion } from '../components/api.js';

const QuestionForm = ({ documentId, onAnswer }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await askQuestion(documentId, question);
      if (response.answer) {
        onAnswer(response.answer);
        setQuestion(''); // Clear the question after successful answer
      } else {
        setError('No answer received');
      }
    } catch (error) {
      console.error('Failed to get answer:', error);
      setError('Failed to get answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about the document..."
          disabled={loading}
          rows={3}
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <button type="submit" disabled={loading || !question.trim()}>
          {loading ? 'Getting Answer...' : 'Ask Question'}
        </button>
      </form>
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default QuestionForm;