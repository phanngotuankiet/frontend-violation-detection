import React, { useEffect, useState } from "react";
import { adminService } from "../../../../../api/admin.service";

const TopContributors = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getTopContributors();
        console.log(data);

        setStats(data);
      } catch (error) {
        console.error("Error fetching contributors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">Top Đóng Góp Tổng Thể</h3>
        <div className="space-y-4">
          {stats.topOverall.map((user: any, index: number) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <span className="text-lg font-bold text-gray-500 mr-4">
                  #{index + 1}
                </span>
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Tổng đóng góp</p>
                <p className="font-bold text-blue-600">{user.total}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Top Người Đặt Câu Hỏi</h3>
          {stats.topQuestioners.map((user: any, index: number) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-2"
            >
              <span>{user.name}</span>
              <span className="font-bold">{user._count.questions} câu hỏi</span>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Top Người Trả Lời</h3>
          {stats.topAnswerers.map((user: any, index: number) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-2"
            >
              <span>{user.name}</span>
              <span className="font-bold">
                {user._count.answers} câu trả lời
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Top Người Bình Luận</h3>
          {stats.topCommenters.map((user: any, index: number) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-2"
            >
              <span>{user.name}</span>
              <span className="font-bold">
                {user._count.comments} bình luận
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopContributors;
