// src/components/Answer/AddAnswer.tsx
import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import styles from "./AddAnswer.module.css";
import { answerApi } from "../../../../api/forum.service";

interface AddAnswerProps {
  questionId: number;
  onAnswerAdded: () => void;
}

const AddAnswer: React.FC<AddAnswerProps> = ({ questionId, onAnswerAdded }) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await answerApi.create({
        content,
        questionId,
      });
      setContent("");
      onAnswerAdded();
    } catch (error) {
      console.error("Failed to add answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className={styles.form}>
      <TextField
        multiline
        rows={4}
        fullWidth
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your answer here..."
        variant="outlined"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!content.trim() || isSubmitting}
        className={styles.submitButton}
      >
        {isSubmitting ? "Posting..." : "Post Your Answer"}
      </Button>
    </Box>
  );
};

export default AddAnswer;
