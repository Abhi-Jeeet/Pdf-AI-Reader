import React, { useRef } from 'react';
import {
  Button,
  Box,
  Typography,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

const FileUpload = ({ setCurrentFile, setLoading, onSuccess, onError }) => {
  const fileInputRef = useRef();

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      onError('Please upload a PDF file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setCurrentFile(file.name);
      onSuccess('File uploaded successfully!');
    } catch (error) {
      onError(error.response?.data?.detail || 'Error uploading file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box textAlign="center">
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileUpload}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      <Button
        variant="contained"
        startIcon={<CloudUploadIcon />}
        onClick={() => fileInputRef.current.click()}
        sx={{ mb: 2 }}
      >
        Upload PDF
      </Button>
      <Typography variant="body2" color="textSecondary">
        Upload a PDF file to get started
      </Typography>
    </Box>
  );
};

export default FileUpload;