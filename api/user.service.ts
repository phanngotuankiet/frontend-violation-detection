import axios from "axios";

const API_URL = "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  id: number;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

export const userService = {
  // Lấy thông tin user hiện tại
  getProfile: async (): Promise<User> => {
    const response = await axiosInstance.get("/users/me");
    return response.data;
  },

  // Cập nhật tên user
  updateName: async (name: string): Promise<User> => {
    const response = await axiosInstance.patch("/users/update-name", { name });
    return response.data;
  },
};
