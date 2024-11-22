import Answer from "@/constant/Answer";
import Question from "@/constant/Question";
import Comment from "@/constant/Comment";
import axios from "axios";

const API_URL = "http://localhost:3000";

// Đây là axios instance với config mặc định
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const questionApi = {
  getAll: () => axiosInstance.get<Question[]>("/questions"),
  getById: (id: number) => axiosInstance.get<Question>(`/questions/${id}`),
  create: (data: { title: string; content: string; userId: number }) =>
    axiosInstance.post<Question>("/questions", data),
  update: (id: number, data: { title: string; content: string }) =>
    axiosInstance.put<Question>(`/questions/${id}`, data),
  delete: (id: number) => axiosInstance.delete(`/questions/${id}`),
};

export const answerApi = {
  getByQuestionId: (questionId: number) =>
    axiosInstance.get<Answer[]>(`/answers/question/${questionId}`),
  create: (data: { content: string; questionId: number }) =>
    axiosInstance.post<Answer>("/answers", data),
  update: (id: number, data: { content: string }) =>
    axiosInstance.put<Answer>(`/answers/${id}`, data),
  delete: (id: number) => axiosInstance.delete(`/answers/${id}`),
  accept: (id: number) => axiosInstance.put<Answer>(`/answers/${id}/accept`),
};

export const commentApi = {
  getByAnswerId: (answerId: number) =>
    axiosInstance.get<Comment[]>(`/comments/answer/${answerId}`),
  create: (data: { content: string; answerId: number }) =>
    axiosInstance.post<Comment>("/comments", data),
  update: (id: number, data: { content: string }) =>
    axiosInstance.put<Comment>(`/comments/${id}`, data),
  delete: (id: number) => axiosInstance.delete(`/comments/${id}`),
};
