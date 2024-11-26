// src/components/Question/QuestionDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container } from "@mui/material";
import { useAuth } from "../../../context/AuthContext";
import { questionApi, answerApi } from "../../../../api/forum.service";
import AnswerList from "../Answer/AnswerList";
import AddAnswer from "../Answer/AddAnswer";
import Answer from "@/constant/Answer";
import Navbar from "../../dashboard/Navbar";

interface QuestionDetail {
  id: number;
  title: string;
  content: string;
  user: {
    id: number;
    name: string;
  };
  answers: Answer[];
  createdAt: string;
}

const QuestionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const [question, setQuestion] = useState<QuestionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestionDetail();
  }, [id]);

  const fetchQuestionDetail = async () => {
    try {
      const { data } = await questionApi.getById(Number(id));
      setQuestion(data);
    } catch (error) {
      console.error("Failed to fetch question:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerAccept = async (answerId: number) => {
    try {
      await answerApi.accept(answerId);
      fetchQuestionDetail();
    } catch (error) {
      console.error("Failed to accept answer:", error);
    }
  };

  const handleAnswerEdit = async (answerId: number, content: string) => {
    try {
      await answerApi.update(answerId, { content });
      fetchQuestionDetail();
    } catch (error) {
      console.error("Failed to update answer:", error);
    }
  };

  const handleAnswerDelete = async (answerId: number) => {
    try {
      await answerApi.delete(answerId);
      fetchQuestionDetail();
    } catch (error) {
      console.error("Failed to delete answer:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!question) return <div>Question not found</div>;

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" className="mt-10">
        {/* <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {question.title}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Asked by {question.user.name} on{" "}
              {new Date(question.createdAt).toLocaleDateString()}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {question.content}
            </Typography>
          </CardContent>
        </Card> */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="p-6">
            {/* Title */}
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              {question.title}
            </h1>

            {/* Content */}
            <div className="prose max-w-none mb-6">
              <p className="text-gray-700 leading-relaxed">
                {question.content}
              </p>
            </div>

            {/* Metadata */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {question.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">
                    {question.user.name}
                  </p>
                  <p className="text-gray-500">
                    Asked on {new Date(question.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            {question.answers.length} Answers
          </Typography>
          <AnswerList
            answers={question.answers}
            questionId={question.id}
            currentUserId={currentUser?.id ?? null}
            questionAuthorId={question.user.id}
            onAnswerAccepted={handleAnswerAccept}
            onAnswerEdit={handleAnswerEdit}
            onAnswerDelete={handleAnswerDelete}
          />
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Your Answer
          </Typography>
          <AddAnswer
            questionId={question.id}
            onAnswerAdded={fetchQuestionDetail}
          />
        </Box> */}
        <div className="max-w-4xl mx-auto">
          {/* Answers Section */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Answers</h2>
              <span className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full">
                {question.answers.length}
              </span>
            </div>

            <div className="space-y-6">
              <AnswerList
                userRole={currentUser?.role ?? "user"}
                answers={question.answers}
                questionId={question.id}
                currentUserId={currentUser?.id ?? null}
                questionAuthorId={question.user.id}
                onAnswerAccepted={handleAnswerAccept}
                onAnswerEdit={handleAnswerEdit}
                onAnswerDelete={handleAnswerDelete}
              />
            </div>
          </div>

          {/* Your Answer Section */}
          <div className="mt-12 border-t border-gray-200 pt-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Your Answer
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Share your knowledge with the community
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <AddAnswer
                questionId={question.id}
                onAnswerAdded={fetchQuestionDetail}
              />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default QuestionDetail;
