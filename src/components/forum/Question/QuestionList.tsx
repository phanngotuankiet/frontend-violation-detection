// src/components/Question/QuestionList.tsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { questionApi } from "../../../../api/forum.service";
import Question from "@/constant/Question";
import QuestionForm from "./QuestionForm";
import styles from "./QuestionList.module.css";
import Navbar from "../../dashboard/Navbar";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export const QuestionList: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<number | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const { data } = await questionApi.getAll();
    setQuestions(data);
  };

  const handleConfirmDelete = async () => {
    if (questionToDelete) {
      await questionApi.delete(questionToDelete);
      fetchQuestions();
      setDeleteModalOpen(false);
      setQuestionToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setQuestionToDelete(null);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const sortedQuestions = questions
    .filter((q) => (tabValue === 0 ? true : q.user.id === currentUser?.id))
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  return (
    <>
      <Navbar />
      <Container maxWidth="lg" className={styles.container}>
        <Box sx={{ mb: 5 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              mb: 4,
              pb: 3,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                background: "linear-gradient(to right, #2563eb, #4f46e5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}
            >
              Hỏi & Đáp
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setSelectedQuestion(null);
                setOpenForm(true);
              }}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                textTransform: "none",
                background: "linear-gradient(to right, #2563eb, #4f46e5)",
                boxShadow: "0 4px 14px 0 rgba(37, 99, 235, 0.2)",
                "&:hover": {
                  background: "linear-gradient(to right, #1d4ed8, #4338ca)",
                  boxShadow: "0 6px 20px 0 rgba(37, 99, 235, 0.3)",
                },
              }}
            >
              Đặt câu hỏi
            </Button>
          </Stack>

          <Box
            sx={{
              borderBottom: 2,
              borderColor: "divider",
              mb: 4,
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 500,
                  minWidth: 120,
                  "&.Mui-selected": {
                    background: "linear-gradient(to right, #2563eb, #4f46e5)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  },
                },
                "& .MuiTabs-indicator": {
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                  background: "linear-gradient(to right, #2563eb, #4f46e5)",
                },
              }}
            >
              <Tab label="Tất cả câu hỏi" />
              <Tab label="Câu hỏi của tôi" />
            </Tabs>
          </Box>
        </Box>

        <Stack spacing={3}>
          {sortedQuestions.map((question) => (
            <Card
              key={question.id}
              sx={{
                "&:hover": {
                  boxShadow: 3,
                  transition: "box-shadow 0.3s ease-in-out",
                },
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Link
                  to={`/questions/${question.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{
                      mb: 2,
                      "&:hover": {
                        color: "primary.dark",
                      },
                      textAlign: "left"
                    }}
                  >
                    {question.title}
                  </Typography>
                </Link>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    display: "-webkit-box",
                    overflow: "hidden",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 3,
                    textAlign: "left"
                  }}
                >
                  {question.content}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Được hỏi bởi{" "}
                      <Typography
                        component="span"
                        variant="caption"
                        color="primary"
                      >
                        {question.user.name}
                      </Typography>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      •
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(question.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>

                  {currentUser?.id === question.user.id && (
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        startIcon={<EditIcon />}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          borderColor: "#2563eb",
                          color: "#2563eb",
                          "&:hover": {
                            borderColor: "#1d4ed8",
                            background: "linear-gradient(to right, #2563eb, #4f46e5)",
                            color: "white",
                          },
                        }}
                        onClick={() => {
                          setSelectedQuestion(question);
                          setOpenForm(true);
                        }}
                      >
                        Sửa
                      </Button>
                      <Button
                        startIcon={<DeleteIcon />}
                        size="small"
                        variant="outlined"
                        color="error"
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          "&:hover": {
                            backgroundColor: "error.light",
                            color: "white",
                          },
                        }}
                        onClick={() => {
                          setQuestionToDelete(question.id);
                          setDeleteModalOpen(true);
                        }}
                      >
                        Xóa
                      </Button>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
        <QuestionForm
          open={openForm}
          onClose={() => {
            setOpenForm(false);
            setSelectedQuestion(null);
          }}
          question={selectedQuestion}
          onSuccess={() => {
            fetchQuestions();
            setOpenForm(false);
            setSelectedQuestion(null);
          }}
        />
        <Dialog open={deleteModalOpen} onClose={handleCancelDelete}>
          <DialogTitle>Xóa Câu Hỏi</DialogTitle>
          <DialogContent>
            Bạn có chắc chắn muốn xóa câu hỏi này? Hành động này không thể hoàn tác.
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete} color="primary">
              Hủy
            </Button>
            <Button
              onClick={handleConfirmDelete}
              color="error"
              variant="contained"
            >
              Xóa
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};
export default QuestionList;
