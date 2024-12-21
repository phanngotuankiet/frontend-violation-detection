/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import Navbar from "../dashboard/Navbar";
import SearchBar from "../search/SearchBar";
import { videoService } from "../../../api/video.service";
import { useAuth } from "../../context/AuthContext";

interface ProcessedVideo {
  id: string;
  title: string;
  timestamp: string;
  label: string;
  thumbnailUrl: string;
  confidence: number;
}
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
  // const [selectedFilter, setSelectedFilter] = useState("all");
  // const [videos, setVideos] = useState<Video[]>([]);

  // useEffect(() => {
  //   const fetchVideos = async () => {
  //     try {
  //       const userId = localStorage.getItem("userId") || "1"; // Get from auth context
  //       const response = await videoService.getUserVideos(userId);
  //       console.log(response);

  //       setVideos(response);
  //     } catch (error) {
  //       console.error("Error fetching videos:", error);
  //     } finally {
  //       // setLoading(false);
  //     }
  //   };

  //   fetchVideos();
  // }, []);

  // const getVideoResult = (video: Video): number | undefined => {
  //   let maxConfidence: number | null = null;

  //   for (const processed of video.processed) {
  //     for (const prediction of processed.predictions) {
  //       if (maxConfidence === null || prediction.confidence > maxConfidence) {
  //         maxConfidence = prediction.confidence;
  //       }
  //     }
  //   }
  //   return maxConfidence!;
  // };

  // // Dữ liệu mẫu - thay thế bằng API thực tế

  // const crimeLabels = [
  //   "Tất Cả",
  //   "Lạm Dụng",
  //   "Bắt Giữ",
  //   "Phóng Hỏa",
  //   "Hành Hung",
  //   "Đột Nhập",
  //   "Nổ",
  //   "Đánh Nhau",
  //   "Tai Nạn Giao Thông",
  //   "Cướp",
  //   "Nổ Súng",
  //   "Trộm Cắp",
  //   "Ăn Cắp",
  //   "Phá Hoại",
  //   "Video Bình Thường",
  // ];

  // // const filteredVideos =
  // //   selectedFilter === "all"
  // //     ? mockVideos
  // //     : mockVideos.filter((video) => video.label === selectedFilter);

  // return (
  //   <>
  //     <Navbar isAdmin={false}/>
  //     <div className="min-h-screen bg-gray-50">
  //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  //         <SearchBar />
  //       </div>
  //       {/* <video
  //         width="100%"
  //         controls
  //         src={`http://localhost:3000/video/${videos[0].id}`}
  //       /> */}
  //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  //         <div className="mb-8">
  //           <h1 className="text-3xl font-bold text-gray-900">Video Đã Xử Lý</h1>
  //           <p className="mt-2 text-gray-600">
  //             Xem lại tất cả video đã xử lý và các vi phạm được phát hiện
  //           </p>
  //         </div>
  //         {/* <video
  //           src={`http://localhost:3000/video/${videos[0].id}`}
  //           // alt={video.title}
  //           className="w-full h-48 object-cover"
  //         /> */}
  //         {/* Bộ lọc */}
  //         <div className="mb-8 overflow-x-auto">
  //           <div className="flex space-x-2 pb-3">
  //             {crimeLabels.map((label) => (
  //               <button
  //                 key={label}
  //                 onClick={() => setSelectedFilter(label.toLowerCase())}
  //                 className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
  //                 ${
  //                   selectedFilter === label.toLowerCase()
  //                     ? "bg-blue-600 text-white"
  //                     : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
  //                 }`}
  //               >
  //                 {label}
  //               </button>
  //             ))}
  //           </div>
  //         </div>

  //         {/* Lưới Video */}
  //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  //           {videos.map((video) => {
  //             const getVideo = getVideoResult(video);
  //             console.log(getVideo);

  //             return (
  //               <div
  //                 key={video.id}
  //                 className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
  //               >
  //                 <div className="relative">
  //                   <video
  //                     src={`http://localhost:3000/video/${video.id}`}
  //                     controls
  //                     // alt={video.title}
  //                     className="w-full h-48 object-cover"
  //                   />
  //                   {getVideo !== undefined && (
  //                     <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded-lg text-sm">
  //                       {Math.round(getVideo * 100)}% độ chính xác
  //                     </div>
  //                   )}
  //                 </div>

  //                 <div className="p-4">
  //                   <div className="flex justify-between items-start mb-2">
  //                     <h3 className="text-lg font-semibold text-gray-900">
  //                       {video.title ? video.title : "Video Chưa Đặt Tên"}
  //                     </h3>
  //                     <span
  //                       //   className={`px-2 py-1 rounded-full text-xs font-medium
  //                       // ${
  //                       //   video.processed[0].detect === "Đánh Nhau"
  //                       //     ? "bg-red-100 text-red-800"
  //                       //     : video.label === "Trộm Cắp"
  //                       //     ? "bg-yellow-100 text-yellow-800"
  //                       //     : "bg-blue-100 text-blue-800"
  //                       // }`}
  //                       className="px-2 py-1 rounded-full text-xs font-medium
  //                     "
  //                     >
  //                       {video.processed[0]?.detect || "Không Xác Định"}
  //                     </span>
  //                   </div>

  //                   <div className="text-sm text-gray-500">
  //                     Xử lý vào: {video.createdAt}
  //                   </div>

  //                   <div className="mt-4 flex space-x-2">
  //                     <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
  //                       Xem Chi Tiết
  //                     </button>
  //                     <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">
  //                       Tải Báo Cáo
  //                     </button>
  //                   </div>
  //                 </div>
  //               </div>
  //             );
  //           })}
  //         </div>
  //       </div>
  //     </div>
  //   </>
  // );
  const { user: currentUser } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("all");

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
      <Navbar isAdmin={currentUser?.role === "admin"} />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                const confidence = getVideoResult(video);
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
                          {video.title || "Video Chưa Đặt Tên"}
                        </h3>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {video.processed[0]?.detect?.join(", ") ||
                            "Không Xác Định"}
                        </span>
                      </div>

                      <div className="text-sm text-gray-500">
                        Xử lý vào: {new Date(video.createdAt).toLocaleString()}
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
