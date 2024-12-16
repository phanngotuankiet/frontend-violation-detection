import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../dashboard/Navbar";
import VideoAnalysisResult from "../analysis/VideoAnalysisResult";
import { useIztro } from "./iztroHooks/useIztro";

import { astro } from "iztro";
import { IztrolabeNaikyo, IztrolabeProps } from "./Iztrolabe";
import { FormInputIztro } from "./FormInputIztro";

interface AnalysisResult {
  confidences: {
    [key: string]: number;
  };
  detected_crimes: string[];
}

const Evaluate = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState<IztrolabeProps | null>(null);

  const { astrolabe, horoscope, setHoroscope } = useIztro({
    birthday: "2001-12-9",
    birthTime: 11,
    gender: "male",
    birthdayType: "solar",
    fixLeap: true,
    isLeapMonth: true,
    lang: "vi",
    options: {},
  });

  console.log("horoscope", horoscope);
  useEffect(() => {
    const astrolabe = astro.bySolar("2001-12-9", 11, "男", true, "vi-VN");

    console.log("astrolabe", astrolabe);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("video", file);

    try {
      setIsProcessing(true);
      const uploadResponse = await axios.post(
        "http://localhost:8000/api/v1/videos/process",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percentCompleted);
            }
          },
        }
      );

      if (uploadResponse.status === 200) {
        const { data } = uploadResponse.data;
        setAnalysisResult({
          confidences: data.confidences,
          detected_crimes: data.detected_crimes,
        });
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Lỗi khi xử lý video");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type.startsWith("video/")) {
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0] || null;
    setFile(newFile);
    setProgress(0);
    setAnalysisResult(null);
    setThumbnail(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-center items-center w-[70%] mx-auto">
        {formData && (
          <IztrolabeNaikyo
            birthday={formData?.birthday ?? ""}
            birthTime={formData?.birthTime ?? 11}
            gender={formData?.gender ?? "male"}
            birthdayType={formData?.birthdayType ?? "solar"}
            fixLeap={true}
            isLeapMonth={true}
            lang="vi"
            options={{}}
          />
        )}
      </div>
      <FormInputIztro onSubmit={setFormData} />

      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-gray-800 text-center">
            Hệ thống Phát hiện Tội phạm
          </h1>
          <p className="text-gray-600 text-center mb-12">
            Tải lên video để phân tích và phát hiện hành vi bạo lực
          </p>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div
              className={`border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Kéo và thả video vào đây
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">hoặc</p>
                  <div className="mt-2">
                    <label
                      htmlFor="video-file"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Chọn tệp video
                      <input
                        className="sr-only"
                        type="file"
                        id="video-file"
                        accept="video/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>

                {file && (
                  <div className="text-sm text-gray-600 text-center">
                    Đã chọn: {file.name}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!file}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
                    file
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Phân tích ngay
                </button>
              </form>

              {progress > 0 && (
                <div className="mt-6">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                          Đang xử lý
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-blue-600">
                          {progress}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
                      <div
                        style={{ width: `${progress}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {(thumbnail || analysisResult) && (
            <div className="grid grid-cols-1 gap-8">
              {thumbnail && (
                <div className="overflow-hidden rounded-xl">
                  <img
                    src={thumbnail}
                    alt="Video Thumbnail"
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
              {analysisResult && (
                <VideoAnalysisResult
                  confidences={analysisResult.confidences}
                  detectedCrimes={analysisResult.detected_crimes}
                />
              )}
            </div>
          )}

          {isProcessing && (
            <div className="flex flex-col items-center justify-center my-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Đang xử lý video...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Evaluate;
