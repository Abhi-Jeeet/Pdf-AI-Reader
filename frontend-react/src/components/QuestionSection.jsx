import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const QuestionSection = ({ filename, onError }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/ask', null, {
        params: {
          filename: filename,
          question: question,
        },
      });

      setAnswer(response.data.answer);
    } catch (error) {
      onError(error.response?.data?.detail || 'Error getting answer');
      setAnswer('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <form onSubmit={handleQuestionSubmit}>
        <TextField
          fullWidth
          label="Ask a question about the PDF"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading || !question.trim()}
          sx={{ mb: 2 }}
        >
          Ask Question
        </Button>
      </form>

      {loading && (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress />
        </Box>
      )}

      {answer && (
        <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Answer:
          </Typography>
          <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
            {answer}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default QuestionSection;