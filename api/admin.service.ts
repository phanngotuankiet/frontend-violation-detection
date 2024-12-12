import axios from "axios";

const API_URL = "http://localhost:3000";

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

export const adminService = {
  getAllQuestions: async () => {
    const response = await axiosInstance.get("/admin/questions");
    return response.data;
  },
  deleteQuestion: async (id: number) => {
    const response = await axiosInstance.delete(`/admin/questions/${id}`);
    return response.data;
  },
  getAllAnswers: async () => {
    const response = await axiosInstance.get("/admin/answers");
    return response.data;
  },
  deleteAnswer: async (id: number) => {
    const response = await axiosInstance.delete(`/admin/answers/${id}`);
    return response.data;
  },
  toggleAnswerAcceptance: async (id: number) => {
    const response = await axiosInstance.put(
      `/admin/answers/${id}/toggle-acceptance`
    );
    return response.data;
  },
  getAllComments: async () => {
    const response = await axiosInstance.get("/admin/comments");
    return response.data;
  },
  deleteComment: async (id: number) => {
    const response = await axiosInstance.delete(`/admin/comments/${id}`);
    return response.data;
  },
};
