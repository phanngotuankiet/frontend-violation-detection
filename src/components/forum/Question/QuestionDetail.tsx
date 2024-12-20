// src/components/Question/QuestionDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container } from "@mui/material";
import { useAuth } from "../../../context/AuthContext";
import { questionApi, answerApi } from "../../../../api/forum.service";
import AnswerList from "../Answer/AnswerList";
import AddAnswer from "../Answer/AddAnswer";
import Answer from "@/constant/Answer";
import Navbar from "../../dashboard/Navbar";
import { ArrowLeft } from "@mui/icons-material";

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

const QuestionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const [question, setQuestion] = useState<QuestionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const isAdmin = currentUser?.role === "admin";
  const navigate = useNavigate();
  useEffect(() => {
    fetchQuestionDetail();
  }, [id]);

  const fetchQuestionDetail = async () => {
    try {
      const { data } = await questionApi.getById(Number(id));
      setQuestion(data);
    } catch (error) {
      console.error("không thể tải câu hỏi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerAccept = async (answerId: number) => {
    try {
      await answerApi.accept(answerId);
      fetchQuestionDetail();
    } catch (error) {
      console.error("không thể chấp nhận câu trả lời:", error);
    }
  };

  const handleAnswerEdit = async (answerId: number, content: string) => {
    try {
      await answerApi.update(answerId, { content });
      fetchQuestionDetail();
    } catch (error) {
      console.error("không thể cập nhật câu trả lời:", error);
    }
  };

  const handleAnswerDelete = async (answerId: number) => {
    try {
      await answerApi.delete(answerId);
      fetchQuestionDetail();
    } catch (error) {
      console.error("không thể xóa câu trả lời:", error);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (!question) return <div>Không tìm thấy câu hỏi</div>;

  return (
    <>
      <Navbar isAdmin={false}/>
      <Container maxWidth="lg" className="mt-10">
        <div className="relative flex justify-start">
          <button
            onClick={() => navigate("/forum")}
            className="mb-6 p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md"
            aria-label="Quay lại"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="p-6">
            {/* tiêu đề */}
            <h1 className="text-2xl font-semibold text-gray-900 mb-4 text-left">
              {question.title}
            </h1>

            {/* nội dung */}
            <div className="prose max-w-none mb-6 text-left">
              <p className="text-gray-700 leading-relaxed">
                {question.content}
              </p>
            </div>

            {/* thông tin chi tiết */}
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
                  <p className="text-gray-900 font-medium text-left">
                    {question.user.name}
                    {question.user.role === "admin" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-4 w-4 text-blue-500"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </p>
                  <p className="text-gray-500">
                    Đã hỏi vào{" "}
                    {new Date(question.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* phần câu trả lời */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Câu trả lời
              </h2>
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
                isAdmin={isAdmin}
              />
            </div>
          </div>

          {/* phần trả lời của bạn */}
          <div className="mt-12 border-t border-gray-200 pt-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 text-left">
                Câu trả lời của bạn
              </h2>
              <p className="mt-1 text-sm text-gray-500 text-left">
                Chia sẻ kiến thức của bạn với cộng đồng
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
