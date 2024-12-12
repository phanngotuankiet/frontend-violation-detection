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
      const res = await answerApi.create({
        content,
        questionId,
      });
      console.log("res", res);

      setContent("");
      onAnswerAdded();
    } catch (error) {
      console.error("Không thể thêm câu trả lời:", error);
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
        placeholder="Viết câu trả lời của bạn tại đây..."
        variant="outlined"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!content.trim() || isSubmitting}
        className={styles.submitButton}
      >
        {isSubmitting ? "Đang đăng..." : "Đăng câu trả lời"}
      </Button>
    </Box>
  );
};

export default AddAnswer;
