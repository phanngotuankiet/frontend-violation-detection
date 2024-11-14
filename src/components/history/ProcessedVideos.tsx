import { useState } from "react";
import Navbar from "../dashboard/Navbar";

interface ProcessedVideo {
  id: string;
  title: string;
  timestamp: string;
  label: string;
  thumbnailUrl: string;
  confidence: number;
}

const ProcessedVideos = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Dữ liệu mẫu - thay thế bằng API thực tế
  const mockVideos: ProcessedVideo[] = [
    {
      id: "1",
      title: "Camera Đường Phố #1",
      timestamp: "2024-01-15 14:30",
      label: "Đánh Nhau",
      thumbnailUrl: "https://picsum.photos/300/200",
      confidence: 0.89,
    },
    {
      id: "2",
      title: "Camera An Ninh Trung Tâm Thương Mại #123",
      timestamp: "2024-01-15 15:45",
      label: "Trộm Cắp",
      thumbnailUrl: "https://picsum.photos/300/200",
      confidence: 0.95,
    },
    // Thêm video mẫu nếu cần
  ];

  const crimeLabels = [
    "Tất Cả",
    "Lạm Dụng",
    "Bắt Giữ",
    "Phóng Hỏa",
    "Hành Hung",
    "Đột Nhập",
    "Nổ",
    "Đánh Nhau",
    "Tai Nạn Giao Thông",
    "Cướp",
    "Nổ Súng",
    "Trộm Cắp",
    "Ăn Cắp",
    "Phá Hoại",
    "Video Bình Thường",
  ];

  const filteredVideos =
    selectedFilter === "all"
      ? mockVideos
      : mockVideos.filter((video) => video.label === selectedFilter);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Video Đã Xử Lý</h1>
            <p className="mt-2 text-gray-600">
              Xem lại tất cả video đã xử lý và các vi phạm được phát hiện
            </p>
          </div>

          {/* Bộ lọc */}
          <div className="mb-8 overflow-x-auto">
            <div className="flex space-x-2 pb-3">
              {crimeLabels.map((label) => (
                <button
                  key={label}
                  onClick={() => setSelectedFilter(label.toLowerCase())}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                  ${
                    selectedFilter === label.toLowerCase()
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Lưới Video */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded-lg text-sm">
                    {Math.round(video.confidence * 100)}% độ chính xác
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {video.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium
                    ${
                      video.label === "Đánh Nhau"
                        ? "bg-red-100 text-red-800"
                        : video.label === "Trộm Cắp"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                    >
                      {video.label}
                    </span>
                  </div>

                  <div className="text-sm text-gray-500">
                    Xử lý vào: {video.timestamp}
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                      Xem Chi Tiết
                    </button>
                    <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">
                      Tải Báo Cáo
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProcessedVideos;
