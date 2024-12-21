import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Avatar,
  Divider,
  Paper,
  // TextField,
  // Button,
} from "@mui/material";
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  ChatBubble as ChatBubbleIcon,
} from "@mui/icons-material";
// import {
//   QuestionForForum,
//   AnswerForForum,
//   CommentForForum,
// } from "@/constant/Forum";
import Answer from "@/constant/Answer";
import { questionApi } from "../../../../../api/forum.service";
import AddAnswer from "../../../../components/forum/Answer/AddAnswer";
import CommentList from "../../../../components/forum/Comment/CommentList";
import { useAuth } from "../../../../context/AuthContext";
import { adminService } from "../../../../../api/admin.service";

interface QuestionDetail {
  id: number;
  title: string;
  content: string;
  user: {
    id: number;
    name: string;
    role: string;
  };
  answers: Answer[];
  createdAt: string;
}
interface QuestionDetailModalProps {
  open: boolean;
  onClose: () => void;
  // question: QuestionForForum | null;
  // onDeleteAnswer: (questionId: number, answerId: number) => Promise<void>;
  // onAcceptAnswer: (answerId: number) => Promise<void>;
  // onDeleteComment: (commentId: number) => Promise<void>;
  // onAddAnswer: (questionId: number, content: string) => Promise<void>;
  // onAddComment: (answerId: number, content: string) => Promise<void>;
  // fetchQuestions: () => void;
  questionId: number;
}

const QuestionDetailModal: React.FC<QuestionDetailModalProps> = ({
  open,
  onClose,
  // question,
  // onDeleteAnswer,
  // onAcceptAnswer,
  // onDeleteComment,
  // onAddAnswer,
  // onAddComment,
  // fetchQuestions,
  questionId,
}) => {
  const { user: currentUser } = useAuth();
  const [question, setQuestion] = useState<QuestionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const isAdmin = currentUser?.role === "admin";
  useEffect(() => {
    fetchQuestionDetail();
  }, [questionId]);

  const fetchQuestionDetail = async () => {
    try {
      const { data } = await questionApi.getById(Number(questionId));
      setQuestion(data);
    } catch (error) {
      console.error("Không thể tải chi tiết câu hỏi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerAccept = async (answerId: number) => {
    try {
      await adminService.toggleAnswerAcceptance(answerId);
      fetchQuestionDetail();
    } catch (error) {
      console.error("Không thể chấp nhận câu trả lời:", error);
    }
  };

  // const handleAnswerEdit = async (answerId: number, content: string) => {
  //   try {
  //     await answerApi.update(answerId, { content });
  //     fetchQuestionDetail();
  //   } catch (error) {
  //     console.error("Không thể cập nhật câu trả lời:", error);
  //   }
  // };

  const handleAnswerDelete = async (answerId: number) => {
    try {
      await adminService.deleteAnswer(answerId);
      fetchQuestionDetail();
    } catch (error) {
      console.error("Không thể xóa câu trả lời:", error);
    }
  };
  const sortedAnswers = question?.answers.sort((a, b) => {
    if (a.isAccepted && !b.isAccepted) return -1;
    if (!a.isAccepted && b.isAccepted) return 1;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  if (loading) return <div>Đang tải...</div>;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 24,
          maxHeight: "90vh",
        },
      }}
    >
      {question ? (
        <>
          {/* Phần đầu */}
          <Box
            sx={{
              px: 3,
              py: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: "grey.50",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              Chi tiết câu hỏi
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <DialogContent sx={{ p: 0 }}>
            <Box sx={{ p: 4 }}>
              {/* Phần tiêu đề câu hỏi */}
              <Box
                sx={{
                  mb: 4,
                  pb: 3,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: "primary.main",
                    mb: 3,
                  }}
                >
                  {question.title}
                </Typography>

                <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: "primary.main",
                      fontSize: "1.2rem",
                    }}
                  >
                    {question.user.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        color: "text.primary",
                        mb: 0.5,
                      }}
                    >
                      {question.user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(question.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  sx={{
                    color: "text.primary",
                    lineHeight: 1.7,
                    fontSize: "1rem",
                  }}
                >
                  {question.content}
                </Typography>
              </Box>

              <Divider />

              {/* Phần câu trả lời */}
              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <ChatBubbleIcon sx={{ fontSize: 20 }} />
                  {question.answers.length} Câu trả lời
                </Typography>

                {sortedAnswers?.map((answer) => (
                  <Paper
                    key={answer.id}
                    sx={{
                      p: 2.5,
                      mb: 2,
                      border: 1,
                      borderColor: answer.isAccepted
                        ? "success.main"
                        : "grey.200",
                      transition: "all 0.2s",
                      "&:hover": {
                        boxShadow: 1,
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                        }}
                      >
                        {answer.user.name.charAt(0)}
                      </Avatar>

                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Box>
                            <Typography sx={{ fontWeight: 500 }}>
                              {answer.user.name}
                              {answer.user.role === "admin" && (
                                <CheckCircleIcon
                                  sx={{
                                    ml: 1,
                                    width: 16,
                                    height: 16,
                                    color: "primary.main",
                                  }}
                                />
                              )}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(answer.createdAt).toLocaleString()}
                              {answer.isEdited && " • đã chỉnh sửa"}
                            </Typography>
                          </Box>

                          <Box sx={{ display: "flex", gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleAnswerAccept(answer.id)}
                              sx={{
                                color: answer.isAccepted
                                  ? "success.main"
                                  : "action.active",
                                "&:hover": {
                                  color: "success.main",
                                },
                              }}
                            >
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleAnswerDelete(answer.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>

                        <Typography sx={{ mt: 1, mb: 2 }}>
                          {answer.content}
                        </Typography>

                        {/* Comments */}
                        {/* {answer.comments?.length > 0 && (
                      <Box
                        sx={{
                          ml: 2,
                          pl: 2,
                          borderLeft: 2,
                          borderColor: "grey.200",
                        }}
                      >
                        {answer.comments.map((comment, index) => (
                          <Box
                            key={comment[0]["id"]}
                            sx={{
                              mb: 2,
                              "&:last-child": { mb: 0 },
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 0.5,
                              }}
                            >
                              <Avatar
                                sx={{
                                  width: 24,
                                  height: 24,
                                  fontSize: "0.75rem",
                                }}
                              >
                                {comment[index].user.name.charAt(0)}
                              </Avatar>
                              <Typography variant="subtitle2">
                                {comment.user.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                • {new Date(comment.createdAt).toLocaleString()}
                              </Typography>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => onDeleteComment(comment.id)}
                                sx={{ ml: "auto" }}
                              >
                                <DeleteIcon sx={{ width: 16, height: 16 }} />
                              </IconButton>
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{
                                ml: 4,
                                color: "text.secondary",
                              }}
                            >
                              {comment.content}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )} */}
                        <CommentList answerId={answer.id} isAdmin={isAdmin} />

                        {/* Add Comment */}
                        {/* <Box
                      component="form"
                      onSubmit={handleAddComment}
                      sx={{ mt: 2 }}
                    >
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Add a comment..."
                        value={
                          newComment.answerId === answer.id
                            ? newComment.content
                            : ""
                        }
                        onChange={(e) =>
                          setNewComment({
                            answerId: answer.id,
                            content: e.target.value,
                          })
                        }
                        sx={{ mb: 1 }}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        size="small"
                        disabled={
                          newComment.answerId !== answer.id ||
                          !newComment.content.trim() ||
                          isSubmittingComment
                        }
                      >
                        {isSubmittingComment ? "Posting..." : "Comment"}
                      </Button>
                    </Box> */}
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>

              {/* Add Answer */}
              {/* <Box component="form" onSubmit={handleAddAnswer} sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Add an Answer
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Write your answer..."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={!newAnswer.trim() || isSubmittingAnswer}
            >
              {isSubmittingAnswer ? "Posting..." : "Submit Answer"}
            </Button>
          </Box> */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <AddAnswer
                  questionId={questionId}
                  onAnswerAdded={fetchQuestionDetail}
                />
              </div>
            </Box>
          </DialogContent>
        </>
      ) : (
        <div>Không tìm thấy câu hỏi</div>
      )}
    </Dialog>
  );
};

export default QuestionDetailModal;
