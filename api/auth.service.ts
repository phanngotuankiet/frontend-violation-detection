import axiosInstance from "./axios.config";

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

export const authService = {
  register: async (payload: RegisterPayload) => {
    const response = await axiosInstance.post("/auth/register", payload);

    return response.data;
  },

  login: async (payload: LoginPayload) => {
    const response = await axiosInstance.post("/auth/login", payload);
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await axiosInstance.post("/auth/refresh", {
      refresh_token: refreshToken,
    });
    return response.data;
  },
};
