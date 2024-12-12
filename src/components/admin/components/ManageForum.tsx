// src/components/admin/components/ManageForum.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Avatar,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { adminService } from "../../../../api/admin.service";
import QuestionDetailModal from "./modal/QuestionDetailModal";
// import { answerApi } from "../../../../api/forum.service";
// import { commentApi } from "../../../../api/forum.service";
import Question from "@/constant/Question";
// // import Answer from "@/constant/Answer";
// // import Comment from "@/constant/Comment";
// import {
//   QuestionForForum,
//   AnswerForForum,
//   CommentForForum,
//   UserForForum,
// } from "@/constant/Forum";
// import User from "@/constant/User";
// import Comment from "@/constant/Comment";

// interface QuestionDetail {
//   id: number;
//   title: string;
//   content: string;
//   user: {
//     id: number;
//     name: string;
//     role: string;
//   };
//   answers: Answer[];
//   createdAt: string;
// }
// interface QuestionDetail {
//   id: number;
//   title: string;
//   content: string;
//   userId: number;
//   createdAt: string;
//   updatedAt: string;
//   user: User;
//   answers: Answer[];
// }

const ManageForum: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllQuestions();
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    try {
      await adminService.deleteQuestion(id);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  // const handleDeleteAnswer = async (questionId: number, answerId: number) => {
  //   try {
  //     await adminService.deleteAnswer(answerId);
  //     fetchQuestions();
  //   } catch (error) {
  //     console.error("Error deleting answer:", error);
  //   }
  // };

  // const handleAcceptAnswer = async (answerId: number) => {
  //   try {
  //     await adminService.toggleAnswerAcceptance(answerId);
  //     fetchQuestions();
  //   } catch (error) {
  //     console.error("Error accepting answer:", error);
  //   }
  // };

  // const handleDeleteComment = async (commentId: number) => {
  //   try {
  //     await adminService.deleteComment(commentId);
  //     fetchQuestions();
  //   } catch (error) {
  //     console.error("Error deleting comment:", error);
  //   }
  // };

  // const handleAddAnswer = async (questionId: number, content: string) => {
  //   if (!content.trim()) return;

  //   try {
  //     await answerApi.create({ content, questionId });
  //     fetchQuestions();
  //   } catch (error) {
  //     console.error("Error adding answer:", error);
  //   }
  // };
  // const handleAddComment = async (answerId: number, content: string) => {
  //   if (!content.trim()) return;

  //   try {
  //     await commentApi.create({ content, answerId });
  //     fetchQuestions();
  //   } catch (error) {
  //     console.error("Error adding comment:", error);
  //   }
  // };
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Forum Management
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {questions.map((question) => (
          <Paper
            key={question.id}
            onClick={() => setSelectedQuestion(question.id)}
            sx={{
              p: 3,
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: (theme) => theme.shadows[4],
              },
            }}
          >
            {/* Title */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: "1.2rem",
                lineHeight: 1.3,
                mb: 2,
                color: "text.primary",
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              {question.title}
            </Typography>

            {/* Metadata and User Info */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "primary.main",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                {question.user.name.charAt(0)}
              </Avatar>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  color: "text.secondary",
                  fontSize: "0.875rem",
                  flex: 1,
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontWeight: 500,
                    color: "text.primary",
                  }}
                >
                  {question.user.name}
                </Typography>

                <Typography component="span" sx={{ fontSize: "4px" }}>
                  ●
                </Typography>

                <Typography component="span">
                  {new Date(question.createdAt).toLocaleDateString()}
                </Typography>

                <Typography component="span" sx={{ fontSize: "4px" }}>
                  ●
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    bgcolor: "action.selected",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: "0.875rem",
                  }}
                >
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: 500,
                      color: "primary.main",
                    }}
                  >
                    {question.answers.length}
                  </Typography>
                  <Typography
                    component="span"
                    sx={{
                      ml: 0.5,
                      color: "text.secondary",
                    }}
                  >
                    answers
                  </Typography>
                </Box>
                <Typography
                  component="span"
                  sx={{
                    ml: 0.5,
                    color: "text.secondary",
                  }}
                >
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Typography>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      <QuestionDetailModal
        open={!!selectedQuestion}
        onClose={() => setSelectedQuestion(null)}
        // question={selectedQuestion}
        // onDeleteAnswer={handleDeleteAnswer}
        // onAcceptAnswer={handleAcceptAnswer}
        // onDeleteComment={handleDeleteComment}
        // onAddAnswer={handleAddAnswer}
        // onAddComment={handleAddComment}
        // fetchQuestions={fetchQuestions}
        questionId={selectedQuestion}
      />
    </Box>
  );
};

export default ManageForum;
