import React, { useState } from "react";
import { Container, Box, CircularProgress, Alert } from "@mui/material";
import FileUpload from "./components/FileUpload";
import QuestionSection from "./components/QuestionSection";
import "./App.css";
import logo from "./assets/aiplanet.svg";

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
    <Box className="app-container" sx={{ height: "100vh", overflow: "hidden" }}>
      <Box
        className="header"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "10px",
          marginLeft: "30px",
          borderBottom: "1px solid #e0e0e0",
          borderWidth: "1px",
          height: "80px",
        }}
      >
        <img
          src={logo}
          alt="Planet Logo"
          className="logo"
          height={50}
          width={150}
        />
        <Box
          sx={{ marginLeft: "auto", paddingTop: "10px", marginRight: "30px" }}
        >
          <FileUpload
            setCurrentFile={setCurrentFile}
            setLoading={setLoading}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </Box>
      </Box>

      <Box
        className="content"
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 80px)",
        }}
      >
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

        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {loading && <CircularProgress />}
        </Box>

        {currentFile && (
          <Box
            sx={{
              marginTop: "auto",
              marginBottom: "20px",
              marginLeft: "30px",
              marginRight: "30px",
            }}
          >
            <QuestionSection filename={currentFile} onError={handleError} />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default App;
