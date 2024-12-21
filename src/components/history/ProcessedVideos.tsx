/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import Navbar from "../dashboard/Navbar";
import SearchBar from "../search/SearchBar";
import { videoService } from "../../../api/video.service";
import { useAuth } from "../../context/AuthContext";
import { searchService } from "../../../api/search.service";

interface Video {
  id: number;
  title: string;
  createdAt: string;
  processed: {
    id: number;
    detect: string[];
    predictions: {
      action: string;
      confidence: number;
    }[];
  }[];
}

const ProcessedVideos = () => {
  const { user: currentUser } = useAuth();
  // const [videos, setVideos] = useState<Video[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUserVideos = async () => {
      if (!currentUser?.id) {
        setError("No user found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await videoService.getUserVideos(
          currentUser.id.toString()
        );
        console.log("response ban đầu từ ML", response);
        setVideos(response);
        setError(null);
      } catch (error) {
        console.error("Error fetching videos:", error);
        setError("Failed to load videos");
      } finally {
        setLoading(false);
      }
    };

    fetchUserVideos();
  }, [currentUser?.id]);

  const getVideoResult = (video: Video): number | undefined => {
    let maxConfidence: number | null = null;
    for (const processed of video.processed) {
      for (const prediction of processed.predictions) {
        if (maxConfidence === null || prediction.confidence > maxConfidence) {
          maxConfidence = prediction.confidence;
        }
      }
    }
    return maxConfidence!;
  };

  const handleSearch = async () => {
    // nếu như user bấm search icon thì thực hiện gọi api tìm kiếm
    const result = await searchService.searchVideos(searchTerm);

    console.log("resultVideos", result.videos);

    // const response = await videoService.getUserVideos(
    //   currentUser.id.toString()
    // );
    // setVideos(response);

    setVideos(result?.videos || []);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
          />

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Video Đã Xử Lý</h1>
            <p className="mt-2 text-gray-600">
              Xem lại tất cả video đã xử lý và các vi phạm được phát hiện
            </p>
          </div>

          {videos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Bạn chưa có video nào được xử lý</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => {
                const confidence =
                // khi và chỉ khi có mảng processed[] trong từng element video thì mới getVideoResult()
                  video.processed && video.processed.length > 0
                    ? getVideoResult(video)
                    : undefined;

                // gồm có params: id, title, createdAt, processed
                return (
                  <div
                    key={video.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      <video
                        src={`http://localhost:3000/video/${video.id}`}
                        controls
                        className="w-full h-48 object-cover"
                      />
                      {confidence !== undefined && (
                        <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded-lg text-sm">
                          {Math.round(confidence * 100)}% độ chính xác
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {video.title || "Video chưa đặt tên"}
                        </h3>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {video.processed && video.processed.length > 0
                            ? video.processed[0]?.detect?.join(", ") ||
                              "Nhãn không xác định"
                            : "Nhãn không xác định"}
                        </span>
                      </div>

                      <div className="text-sm text-gray-500">
                        Xử lý vào: {new Date(video.createdAt).toLocaleString()}
                      </div>

                      {/* <div className="mt-4 flex space-x-2">
                        <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                          Xem Chi Tiết
                        </button>
                        <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">
                          Tải Báo Cáo
                        </button>
                      </div> */}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProcessedVideos;
