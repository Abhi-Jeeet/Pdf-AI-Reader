import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import FileUpload from './components/FileUpload';
import QuestionSection from './components/QuestionSection';
import './App.css';

function App() {
  const [currentFile, setCurrentFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSuccess = (message) => {
    setSuccess(message);
    setError(null);
  };

  const handleError = (message) => {
    setError(message);
    setSuccess(null);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          PDF Question & Answer System
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <FileUpload
            setCurrentFile={setCurrentFile}
            setLoading={setLoading}
            onSuccess={handleSuccess}
            onError={handleError}
          />

          {loading && (
            <Box display="flex" justifyContent="center" my={2}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}

          {currentFile && (
            <QuestionSection
              filename={currentFile}
              onError={handleError}
            />
          )}
        </Paper>
      </Box>
    </Container>
  );
}

export default App;