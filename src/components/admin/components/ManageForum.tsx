/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { adminService } from "../../../../api/admin.service";
import QuestionDetailModal from "./modal/QuestionDetailModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const ManageForum: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const navigate = useNavigate();
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

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin border-4 border-t-4 border-gray-300 border-t-primary w-12 h-12 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen mx-auto p-6 bg-gradient-to-r from-blue-50 to-indigo-100">
      <div className="flex justify-center items-center text-center mb-8 space-x-4">
        <FontAwesomeIcon
          icon={faArrowLeft}
          size="2xl"
          onClick={() => {
            navigate("/superAdmin");
          }}
          className="cursor-pointer"
        />
        <h1 className="text-4xl font-extrabold text-center text-gray-900">
          Forum Management
        </h1>
      </div>

      <div className="space-y-6 w-full flex flex-col justify-center items-center ">
        {questions.map((question) => (
          <div
            key={question.id}
            className=" bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 cursor-pointer py-6 w-3/4"
            onClick={() => setSelectedQuestion(question.id)}
          >
            {/* Title */}
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 hover:text-primary transition-colors duration-300">
              {question.title}
            </h2>

            {/* Metadata and User Info */}
            <div className="flex items-center justify-between  text-gray-500 text-xl">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary text-white flex justify-center items-center rounded-full font-medium">
                  {question.user.name.charAt(0)}
                </div>
                <span>{question.user.name}</span>
                <span>●</span>
                <span>{new Date(question.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Right-aligned answer count and delete button */}
              <div className="flex items-center space-x-4 mr-4">
                <span className="bg-gray-200 px-2 py-1 rounded-md text-primary">
                  {question.answers.length} answers
                </span>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteQuestion(question.id);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <QuestionDetailModal
        open={!!selectedQuestion}
        onClose={() => setSelectedQuestion(null)}
        questionId={selectedQuestion!}
      />
    </div>
  );
};

export default ManageForum;
