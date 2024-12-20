export type SearchStatus = "pending" | "reviewed" | "flagged";

export interface SensitiveSearchNotification {
  type: "SENSITIVE_SEARCH" | "SENSITIVE_SEARCH_UPDATE";
  searchId: number;
  searchTerm?: string;
  category?: string;
  userId?: number;
  status?: SearchStatus;
}

export interface QAEvent {
  type: "question" | "answer" | "comment";
  action: "create" | "update" | "delete";
  data: any;
}
