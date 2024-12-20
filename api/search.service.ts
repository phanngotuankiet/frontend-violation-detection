// src/api/search.service.ts
import { SearchPayload, SensitiveSearchResponse } from "@/constant/Search";
import { SearchStatus } from "@/websocket/websocket.types";
import axios from "axios";

const API_URL = "http://localhost:3000";
// const WS_URL = "ws://localhost:3000/notifications";

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

export interface SearchResult {
  isSensitive: boolean;
  message?: string;
  videos?: Video[];
}

export interface Video {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
}
export interface SearchResponse {
  videos: Video[];
  total: number;
}

export const searchService = {
  searchVideos: async (searchTerm: string) => {
    const response = await axiosInstance.post<SearchResult>("/search/videos", {
      searchTerm,
    });
    return response.data;
  },
  // getSensitiveSearches: async () => {
  //   const response = await axiosInstance.get("/search/sensitive");

  //   return response.data;
  // },
  getSensitiveSearches: async (page: number = 1, limit: number = 10) => {
    const response = await axiosInstance.get(
      `/search/sensitive?page=${page}&limit=${limit}`
    );
    return response.data;
  },
  updateSearchStatus: async (id: number, status: SearchStatus) => {
    const response = await axiosInstance.put(`/search/sensitive/${id}/status`, {
      status,
    });
    return response.data;
  },
  getSearchStats: async () => {
    const response = await axiosInstance.get("/search/stats");
    return response.data;
  },
  checkSearch: async (
    payload: SearchPayload
  ): Promise<SensitiveSearchResponse> => {
    const response = await axiosInstance.post("search/check", payload);
    return response.data;
  },
};
