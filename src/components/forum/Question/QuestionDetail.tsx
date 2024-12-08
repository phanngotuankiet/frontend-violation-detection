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
  };
  answers: Answer[];
  createdAt: string;
}

const QuestionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const [question, setQuestion] = useState<QuestionDetail | null>(null);
  const [loading, setLoading] = useState(true);

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
      <Navbar />
      <Container maxWidth="lg" className="mt-10">
        <div className="relative flex justify-start">
          <button
            onClick={() => navigate('/forum')}
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
                  </p>
                  <p className="text-gray-500">
                    Đã hỏi vào {new Date(question.createdAt).toLocaleDateString()}
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
              <h2 className="text-xl font-semibold text-gray-900">Câu trả lời</h2>
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
