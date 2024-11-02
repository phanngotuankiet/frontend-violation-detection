import { useState } from "react";
import axios from "axios";
import Navbar from "../dashboard/Navbar";

const Evaluate = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("video", file);

    try {
      const response = await axios.post("/upload", formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        },
      });

      const data = response.data;
      if (response.status === 200) {
        setThumbnail(data.thumbnail);
        checkProgress(data.task_id);
      } else {
        alert(data.error || "An error occurred");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Error uploading file");
      }
    }
  };

  const checkProgress = async (taskId: string) => {
    try {
      const response = await fetch(`/progress/${taskId}`);
      const data = await response.json();

      if (data.state === "PENDING") {
        setTimeout(() => checkProgress(taskId), 1000);
      } else if (data.state === "SUCCESS") {
        setResult(data.result);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error checking progress:", err.message);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto pt-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Hệ thống Phát hiện Tội phạm</h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h5 className="text-xl font-semibold mb-4">
            Tải lên Video để Phân tích
          </h5>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="video-file"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Chọn tệp video:
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type="file"
                id="video-file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Phân tích ngay
            </button>
          </form>

          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-6">
              <div
                className="bg-blue-600 h-6 rounded-full transition-all duration-500 flex items-center justify-center text-white text-sm"
                style={{ width: `${progress}%` }}
              >
                {progress}%
              </div>
            </div>
          </div>
        </div>

        {(thumbnail || result) && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h5 className="text-xl font-semibold mb-4">Kết quả Phân tích</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {thumbnail && (
                <div>
                  <img
                    src={thumbnail}
                    alt="Video Thumbnail"
                    className="w-full rounded-lg"
                  />
                </div>
              )}
              <div>
                {result ? (
                  <div className="bg-blue-50 text-blue-800 p-4 rounded-lg">
                    {result}
                  </div>
                ) : (
                  <div className="bg-blue-50 text-blue-800 p-4 rounded-lg">
                    Đang xử lý... Vui lòng đợi.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Evaluate;
