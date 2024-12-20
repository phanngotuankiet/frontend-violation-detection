import axios, { CancelTokenSource } from "axios";

const API_URL = "http://localhost:3000";
const PYTHON_API_URL = "http://localhost:8000";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface VideoUploadPayload {
  title: string;
  description?: string;
  file: File;
}

export interface DetectionResult {
  status: "success" | "error";
  data: {
    confidences: Record<string, number>;
    detected_crimes: string[];
    detected_activities: string[];
  };
}

export const CRIME_THRESHOLDS = {
  vandalism: 0.3,
  shooting: 0.4,
  explosion: 0.4,
  arrest: 0.1,
  assault: 0.05,
  fighting: 0.05,
  "road accidents": 0.05,
  robbery: 0.1,
};
export interface DetectionResponse {
  status: "success" | "error";
  data: {
    confidences: Record<string, number>;
    detected_crimes: string[];
    detected_activities: string[];
  };
}

export const videoService = {
  currentDetectionRequest: null as CancelTokenSource | null,
  async uploadVideo(
    payload: VideoUploadPayload,
    onProgress?: (progress: number) => void
  ) {
    try {
      // Step 1: Upload to NestJS
      const formData = new FormData();
      formData.append("file", payload.file);
      formData.append("title", payload.title);
      if (payload.description) {
        formData.append("description", payload.description);
      }

      const uploadResponse = await axiosInstance.post(
        "/video/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total && onProgress) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress(percent);
            }
          },
        }
      );

      // Step 2: Send to Python for analysis
      const pythonFormData = new FormData();
      pythonFormData.append("video", payload.file);

      const analysisResponse = await axios.post(
        `${PYTHON_API_URL}/api/v1/videos/process`,
        pythonFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (analysisResponse.data.status === "success") {
        // Step 3: Save analysis results
        const processData = {
          videoId: uploadResponse.data.id,
          confidences: analysisResponse.data.data.confidences,
          detected_crimes: analysisResponse.data.data.detected_crimes,
          processedVideoBuffer: analysisResponse.data.data.results_url,
        };

        await axiosInstance.post("/video/process", processData);

        return {
          originalVideo: uploadResponse.data,
          analysis: analysisResponse.data.data,
        };
      }
    } catch (error) {
      console.error("Error in video processing:");
      throw error;
    }
  },
  async getUserVideos(userId: string) {
    try {
      const response = await axiosInstance.get(`/video/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user videos:", error);
      throw error;
    }
  },

  async getVideo(id: number) {
    try {
      const response = await axiosInstance.get(`/video/${id}`, {
        responseType: "blob",
      });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error("Error fetching video:", error);
      throw error;
    }
  },

  async detectFrame(frame: Blob): Promise<DetectionResult> {
    const formData = new FormData();
    formData.append("image", frame);

    const response = await axios.post(
      "http://localhost:8000/api/v1/images/detect",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },
};
