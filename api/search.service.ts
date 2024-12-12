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
// // WebSocket connection handler
// export class WebSocketService {
//   private socket: WebSocket | null = null;
//   private reconnectAttempts = 0;
//   private maxReconnectAttempts = 5;

//   connect() {
//     try {
//       this.socket = new WebSocket(WS_URL);

//       this.socket.onopen = () => {
//         console.log("WebSocket Connected");
//         this.reconnectAttempts = 0;

//         // Send authentication
//         const token = localStorage.getItem("access_token");
//         if (token && this.socket) {
//           this.socket.send(JSON.stringify({ type: "auth", token }));
//         }
//       };

//       this.socket.onclose = () => {
//         if (this.reconnectAttempts < this.maxReconnectAttempts) {
//           setTimeout(() => {
//             this.reconnectAttempts++;
//             this.connect();
//           }, 2000 * Math.pow(2, this.reconnectAttempts));
//         }
//       };
//     } catch (error) {
//       console.error("WebSocket connection failed:", error);
//     }
//   }

//   subscribe(callback: (data: any) => void) {
//     if (this.socket) {
//       this.socket.onmessage = (event) => {
//         const data = JSON.parse(event.data);
//         callback(data);
//       };
//     }
//   }

//   disconnect() {
//     if (this.socket) {
//       this.socket.close();
//       this.socket = null;
//     }
//   }
// }

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
  getSensitiveSearches: async () => {
    const response = await axiosInstance.get("/search/sensitive");

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
