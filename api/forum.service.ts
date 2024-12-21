import Answer from "@/constant/Answer";
import Question from "@/constant/Question";
import Comment from "@/constant/Comment";
import axiosInstance from "./axios.config";

// const API_URL = "http://localhost:3000";

// // Đây là axios instance với config mặc định
// const axiosInstance = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("access_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export const questionApi = {
  // Lấy tất cả câu hỏi
  getAll: () => axiosInstance.get<Question[]>("/questions"),

  // Lấy câu hỏi bằng id
  getById: (id: number) => axiosInstance.get<Question>(`/questions/${id}`),
  // Tạo câu hỏi
  create: (data: { title: string; content: string; userId: number }) =>
    axiosInstance.post<Question>("/questions", data),
  // Cập nhật câu hỏi
  update: (id: number, data: { title: string; content: string }) =>
    axiosInstance.put<Question>(`/questions/${id}`, data),
  // Xóa câu hỏi
  delete: (id: number) => axiosInstance.delete(`/questions/${id}`),
};

export const answerApi = {
  // Lấy tất cả câu trả lời bằng id câu hỏi
  getByQuestionId: (questionId: number) =>
    axiosInstance.get<Answer[]>(`/answers/question/${questionId}`),
  // Tạo câu trả lời
  create: (data: { content: string; questionId: number }) =>
    axiosInstance.post<Answer>("/answers", data),
  // Cập nhật câu trả lời
  update: (id: number, data: { content: string }) =>
    axiosInstance.put<Answer>(`/answers/${id}`, data),
  // Xóa câu trả lời
  delete: (id: number) => axiosInstance.delete(`/answers/${id}`),
  // Chấp nhận câu trả lời
  accept: (id: number) => axiosInstance.put<Answer>(`/answers/${id}/accept`),
};

export const commentApi = {
  // Lấy tất cả bình luận bằng id câu trả lời
  getByAnswerId: (answerId: number) =>
    axiosInstance.get<Comment[]>(`/comments/answer/${answerId}`),
  // Tạo bình luận
  create: (data: { content: string; answerId: number }) =>
    axiosInstance.post<Comment>("/comments", data),
  // Cập nhật bình luận
  update: (id: number, data: { content: string }) =>
    axiosInstance.put<Comment>(`/comments/${id}`, data),
  // Xóa bình luận
  delete: (id: number) => axiosInstance.delete(`/comments/${id}`),
};
