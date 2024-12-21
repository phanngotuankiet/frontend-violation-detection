import React, { useEffect, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Pie, Bar } from "react-chartjs-2";
import { searchService } from "../../../../../api/search.service";

const SensitiveStats = () => {
  interface Stats {
    statusDistribution: {
      pending: number;
      reviewed: number;
      flagged: number;
    };
    topSearchers: {
      id: string;
      name: string;
      email: string;
      totalSearches: number;
    }[];
    topFlagged: {
      id: string;
      name: string;
      email: string;
      flaggedCount: number;
    }[];
  }

  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await searchService.getSensitiveStats();
        console.log(data);

        setStats(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) return <div>Loading...</div>;

  const statusData = {
    labels: ["Đang chờ xử lý", "Đã xử lý", "Gắn cờ"],
    datasets: [
      {
        data: [
          stats.statusDistribution.pending,
          stats.statusDistribution.reviewed,
          stats.statusDistribution.flagged,
        ],
        backgroundColor: ["#FCD34D", "#34D399", "#EF4444"],
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">Phân Bố Trạng Thái</h3>
        <div className="h-64">
          <Pie data={statusData} />
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">
            Top Người Dùng Có Nhiều Tìm Kiếm Nhạy Cảm
          </h3>
          {stats.topSearchers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-2"
            >
              <div>
                <span className="font-semibold">{user.name}</span>
                <span className="text-sm text-gray-500 ml-2">
                  ({user.email})
                </span>
              </div>
              <span className="font-bold">{user.totalSearches} tìm kiếm</span>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-red-600">
            Top Người Dùng Bị Gắn Cờ
          </h3>
          {stats.topFlagged.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-2"
            >
              <div>
                <span className="font-semibold">{user.name}</span>
                <span className="text-sm text-gray-500 ml-2">
                  ({user.email})
                </span>
              </div>
              <span className="font-bold text-red-600">
                {user.flaggedCount} flags
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SensitiveStats;
