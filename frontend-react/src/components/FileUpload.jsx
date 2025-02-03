import React, { useRef } from "react";
import { Button, Box } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import axios from "axios";

const FileUpload = ({ setCurrentFile, setLoading, onSuccess, onError }) => {
  const fileInputRef = useRef();

  //file uploading
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      onError("Please upload a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    //connecting to the backend
    try {
      const response = await axios.post(
        "http://localhost:8000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setCurrentFile(file.name);
      onSuccess("File uploaded successfully!");
    } catch (error) {
      onError(error.response?.data?.detail || "Error uploading file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileUpload}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      <Button
        variant="outlined"
        startIcon={<UploadIcon />}
        onClick={() => fileInputRef.current.click()}
        sx={{
          color: "#000",
          borderColor: "#000",
          "&:hover": {
            borderColor: "#000",
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        Upload PDF
      </Button>
    </Box>
  );
};

export default FileUpload;
