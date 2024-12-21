import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { adminService } from "../../../../../api/admin.service";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const UserStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getUserStats();
        console.log(data);

        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const pieData = {
    labels: stats.roleDistribution.map((item: any) => item.role),
    datasets: [
      {
        data: stats.roleDistribution.map((item: any) => item._count),
        backgroundColor: ["#4F46E5", "#10B981", "#F59E0B"],
      },
    ],
  };

  const barData = {
    labels: stats.monthlyGrowth.map(
      (item: any) => `${item.month}/${item.year}`
    ),
    datasets: [
      {
        label: "Người dùng mới",
        data: stats.monthlyGrowth.map((item: any) => item._count),
        backgroundColor: "#4F46E5",
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Thống kê người dùng</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Phân phối vai trò</h3>
          <div className="h-64">
            <Pie data={pieData} />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Tăng trưởng tháng</h3>
          <div className="h-64">
            <Bar data={barData} />
          </div>
        </div>

        <div className="col-span-2 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-lg">
              Tổng số người dùng:{" "}
              <span className="font-bold">{stats.total}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
