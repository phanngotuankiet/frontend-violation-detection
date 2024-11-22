// src/components/Question/QuestionForm.tsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import { questionApi } from "../../../../api/forum.service";
import Question from "@/constant/Question";

interface QuestionFormProps {
  open: boolean;
  onClose: () => void;
  question?: Question | null;
  onSuccess: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  open,
  onClose,
  question,
  onSuccess,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (question) {
      setTitle(question.title);
      setContent(question.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [question]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (question) {
        await questionApi.update(question.id, { title, content });
      } else {
        await questionApi.create({
          title,
          content,
          userId: 1, // Replace with actual user ID from auth
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving question:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle
          sx={{
            borderBottom: "1px solid",
            borderColor: "divider",
            pb: 2,
          }}
        >
          <Typography variant="h5" fontWeight={500}>
            {question ? "Edit Question" : "Ask a Question"}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
              variant="outlined"
              placeholder="What's your question? Be specific."
              helperText="A good title helps others find and answer your question"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                },
              }}
            />
            <TextField
              label="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              multiline
              rows={6}
              fullWidth
              variant="outlined"
              placeholder="Provide details about your question..."
              helperText="Include all the information someone would need to answer your question"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                },
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            borderTop: "1px solid",
            borderColor: "divider",
            px: 3,
            py: 2,
            gap: 1,
          }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: "none",
            }}
          >
            {question ? "Update" : "Post"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default QuestionForm;
