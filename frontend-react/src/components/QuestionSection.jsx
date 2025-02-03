import React, { useState } from "react";
import {
  TextField,
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Typography,
  Avatar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";

import ai from "../assets/AI.png";

const QuestionSection = ({ filename, onError }) => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = {
      type: "user",
      content: question.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    //connecting to the backend
    try {
      const response = await axios.post("http://localhost:8000/ask", null, {
        params: {
          filename: filename,
          question: question,
        },
      });

      const aiMessage = {
        type: "ai",
        content: response.data.answer,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setQuestion("");
    } catch (error) {
      onError(error.response?.data?.detail || "Error getting answer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="message-container">
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          mb: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxHeight: "60vh",
        }}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent:
                message.type === "user" ? "flex-end" : "flex-start",
            }}
          >
            <Paper
              elevation={1}
              sx={{
                p: 2,
                maxWidth: "70%",
                marginBottom: "10px",
                backgroundColor:
                  message.type === "user" ? "#e3f2fd" : "#e8f5e9",
                borderRadius: "12px",
                borderTopRightRadius: message.type === "user" ? "4px" : "12px",
                borderTopLeftRadius: message.type === "ai" ? "4px" : "12px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                  }}
                >
                  {message.type === "user" ? (
                    "U"
                  ) : (
                    <img
                      src={ai}
                      alt="AI"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </Avatar>
                <Typography>{message.content}</Typography>
              </Box>
            </Paper>
          </Box>
        ))}
      </Box>

      <form
        onSubmit={handleQuestionSubmit}
        style={{ display: "flex", gap: "10px" }}
      >
        <TextField
          fullWidth
          placeholder="Send a message..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          variant="outlined"
          disabled={loading}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#fff",
            },
          }}
        />
        <IconButton
          type="submit"
          disabled={loading || !question.trim()}
          color="primary"
          sx={{ p: "10px" }}
        >
          {loading ? <CircularProgress size={24} /> : <SendIcon />}
        </IconButton>
      </form>
    </Box>
  );
};

export default QuestionSection;
