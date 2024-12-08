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
          userId: 1, // Thay thế bằng ID người dùng thực từ xác thực
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Lỗi khi lưu câu hỏi:", error);
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
          boxShadow: "0 4px 20px rgba(37, 99, 235, 0.15)",
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle
          sx={{
            borderBottom: "1px solid",
            borderColor: "divider",
            pb: 2,
            "& .MuiTypography-root": {
              background: "linear-gradient(to right, #2563eb, #4f46e5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }
          }}
        >
          <Typography variant="h5" fontWeight={500}>
            {question ? "Chỉnh sửa câu hỏi" : "Đặt câu hỏi"}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Tiêu đề"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
              variant="outlined"
              placeholder="Câu hỏi của bạn là gì? Hãy cụ thể."
              helperText="Một tiêu đề tốt giúp người khác tìm và trả lời câu hỏi của bạn"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  "&:hover fieldset": {
                    borderColor: "#2563eb",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#2563eb",
                  }
                },
                "& .MuiFormLabel-root.Mui-focused": {
                  color: "#2563eb"
                }
              }}
            />
            <TextField
              label="Nội dung"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              multiline
              rows={6}
              fullWidth
              variant="outlined"
              placeholder="Cung cấp chi tiết về câu hỏi của bạn..."
              helperText="Bao gồm tất cả thông tin cần thiết để người khác có thể trả lời câu hỏi của bạn"
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
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: "none",
              background: "linear-gradient(to right, #2563eb, #4f46e5)",
              "&:hover": {
                background: "linear-gradient(to right, #1d4ed8, #4338ca)",
              }
            }}
          >
            {question ? "Cập nhật" : "Đăng"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default QuestionForm;
