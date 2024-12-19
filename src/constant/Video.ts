export interface Video {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  url: string;
  createdAt: string;
}
export interface VideoUploadPayload {
  title: string;
  description?: string;
  file: File;
}

export interface VideoAnalysisResult {
  confidences: {
    [key: string]: number;
  };
  detected_crimes: string[];
  results_url: string;
  video_name: string;
}
