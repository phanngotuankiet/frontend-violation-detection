/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { adminService } from "../../../../api/admin.service";
import QuestionDetailModal from "./modal/QuestionDetailModal";

import Navbar from "../../dashboard/Navbar";
import Pagination from "../../pagination/Pagination";

const ManageForum: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  // const navigate = useNavigate();

  const fetchQuestions = async (page: number = 1) => {
    try {
      setLoading(true);
      const data = await adminService.getAllQuestions(page);
      console.log(data);

      setQuestions(data.data);
      setTotalPages(data.meta.lastPage);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchQuestions(currentPage);
  }, [currentPage]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    <div className="min-h-screen bg-gray-100">
      <Navbar isAdmin={true} />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-start">
            {/* <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              <span>Back</span>
            </button> */}
            <h1 className="text-2xl font-bold text-gray-900">
              Quản lí diễn đàn
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No.
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {questions.map((question, index) => (
                    <tr
                      key={question.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                          {question.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          <div className="text-sm font-medium text-gray-900">
                            {question.user.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedQuestion(question.id)}
                          className="text-indigo-600 hover:text-indigo-900 font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
      {/* Modal */}
      <QuestionDetailModal
        open={!!selectedQuestion}
        onClose={() => setSelectedQuestion(null)}
        questionId={selectedQuestion!}
      />
    </div>
  );
};

export default ManageForum;
