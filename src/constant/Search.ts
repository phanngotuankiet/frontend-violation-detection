import { Video } from "./Video";

export interface SearchPayload {
  searchTerm: string;
}
export interface SearchResponse {
  videos: Video[];
  total: number;
}
export interface SensitiveSearchResponse {
  isSensitive: boolean;
  category?: "political" | "adult" | "scam" | "violence";
  message?: string;
}

export interface SearchResult {
  videos: Video[];
  total: number;
}

export interface SearchHistoryItem {
  id: number;
  userId: number;
  searchTerm: string;
  category: string;
  status: "pending" | "reviewed" | "flagged";
  timestamp: string;
  user: {
    name: string;
    email: string;
  };
}
