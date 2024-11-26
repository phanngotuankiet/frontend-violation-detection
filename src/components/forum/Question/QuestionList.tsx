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

  // const handleDelete = async (id: number) => {
  //   if (window.confirm("Are you sure you want to delete this question?")) {
  //     await questionApi.delete(id);
  //     fetchQuestions();
  //   }
  // };

  // const handleDeleteClick = (id: number) => {
  //   setQuestionToDelete(id);
  //   setDeleteModalOpen(true);
  // };

  const handleConfirmDelete = async () => {
    console.log("questionToDelete", questionToDelete);

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
        {/* <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h4">Questions</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedQuestion(null);
              setOpenForm(true);
            }}
          >
            Ask Question
          </Button>
        </Stack>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="All Questions" />
            <Tab label="My Questions" />
          </Tabs>
        </Box> */}
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
                color: "primary.main",
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}
            >
              Questions
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
                boxShadow: 2,
                "&:hover": {
                  boxShadow: 4,
                  backgroundColor: "primary.dark",
                },
              }}
            >
              Ask Question
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
                    color: "primary.main",
                  },
                },
                "& .MuiTabs-indicator": {
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                },
              }}
            >
              <Tab label="All Questions" />
              <Tab label="My Questions" />
            </Tabs>
          </Box>
        </Box>
        {/* <Stack spacing={2}>
          {sortedQuestions.map((question) => (
            <Card key={question.id}>
              <CardContent>
                <Link to={`/questions/${question.id}`}>
                  <Typography variant="h6">{question.title}</Typography>
                </Link>
                <Typography variant="body1">{question.content}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Asked by {question.user.name} on{" "}
                  {new Date(question.createdAt).toLocaleDateString()}
                </Typography>

                {currentUser?.id === question.user.id && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    <Button
                      startIcon={<EditIcon />}
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setSelectedQuestion(question);
                        setOpenForm(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      startIcon={<DeleteIcon />}
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        setQuestionToDelete(question.id);
                        setDeleteModalOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack> */}

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
                      Asked by{" "}
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
                          "&:hover": {
                            backgroundColor: "primary.light",
                            color: "white",
                          },
                        }}
                        onClick={() => {
                          setSelectedQuestion(question);
                          setOpenForm(true);
                        }}
                      >
                        Edit
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
                        Delete
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
          <DialogTitle>Delete Question</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this question? This action cannot be
            undone.
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};
export default QuestionList;
