// import React, { useEffect, useState } from "react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Bar } from "react-chartjs-2";
// import { adminService } from "../../../../../api/admin.service";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const ForumStats = () => {
//   const [stats, setStats] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const data = await adminService.getForumStats();
//         setStats(data);
//       } catch (error) {
//         console.error("Error fetching forum stats:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStats();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   const chartData = {
//     labels: stats.monthly.map((item: any) => `${item.month}/${item.year}`),
//     datasets: [
//       {
//         label: "Câu hỏi",
//         data: stats.monthly.map((item: any) => item.questions),
//         backgroundColor: "#4F46E5",
//       },
//       {
//         label: "Câu trả lời",
//         data: stats.monthly.map((item: any) => item.answers),
//         backgroundColor: "#10B981",
//       },
//       {
//         label: "Bình luận",
//         data: stats.monthly.map((item: any) => item.comments),
//         backgroundColor: "#F59E0B",
//       },
//     ],
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-lg">
//       <h2 className="text-2xl font-bold mb-6">Thống kê hoạt động diễn đàn</h2>

//       <div className="grid grid-cols-3 gap-4 mb-6">
//         <div className="bg-indigo-50 p-4 rounded-lg">
//           <p className="text-indigo-600 font-semibold">Tổng sô câu hỏi</p>
//           <p className="text-2xl font-bold">{stats.total.questions}</p>
//         </div>
//         <div className="bg-green-50 p-4 rounded-lg">
//           <p className="text-green-600 font-semibold">Tổng số câu trả lời</p>
//           <p className="text-2xl font-bold">{stats.total.answers}</p>
//         </div>
//         <div className="bg-yellow-50 p-4 rounded-lg">
//           <p className="text-yellow-600 font-semibold">Tổng số bình luận</p>
//           <p className="text-2xl font-bold">{stats.total.comments}</p>
//         </div>
//       </div>

//       <div className="h-96">
//         <Bar
//           data={chartData}
//           options={{
//             responsive: true,
//             maintainAspectRatio: false,
//             plugins: {
//               legend: {
//                 position: "top" as const,
//               },
//               title: {
//                 display: true,
//                 text: "Hoạt động theo tháng",
//               },
//             },
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default ForumStats;
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { adminService } from "../../../../../api/admin.service";
import TopContributors from "./TopContributors";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ForumStatsData {
  total: {
    questions: number;
    answers: number;
    comments: number;
  };
  monthly: Array<{
    month: number;
    year: number;
    questions: number;
    answers: number;
    comments: number;
  }>;
}

const ForumStats = () => {
  const [stats, setStats] = useState<ForumStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getForumStats();
        setStats(data);
      } catch (error) {
        console.error("Lỗi khi lấy thống kê diễn đàn:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return <div>Đang tải...</div>;
  }

  // Sắp xếp dữ liệu theo tháng
  const sortedMonthlyStats = [...stats.monthly].sort((a, b) => {
    const dateA = new Date(a.year, a.month - 1);
    const dateB = new Date(b.year, b.month - 1);
    return dateA.getTime() - dateB.getTime();
  });

  // Tính trung bình số câu trả lời trên mỗi câu hỏi
  const averageAnswersPerQuestion =
    stats.total.questions > 0
      ? (stats.total.answers / stats.total.questions).toFixed(2)
      : 0;

  const chartData = {
    labels: sortedMonthlyStats.map((item) => `${item.month}/${item.year}`),
    datasets: [
      {
        label: "Câu hỏi",
        data: sortedMonthlyStats.map((item) => item.questions),
        backgroundColor: "#4F46E5",
      },
      {
        label: "Câu trả lời",
        data: sortedMonthlyStats.map((item) => item.answers),
        backgroundColor: "#10B981",
      },
      {
        label: "Bình luận",
        data: sortedMonthlyStats.map((item) => item.comments),
        backgroundColor: "#F59E0B",
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Thống kê hoạt động diễn đàn</h2>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="text-indigo-600 font-semibold">Tổng số câu hỏi</p>
          <p className="text-2xl font-bold">{stats.total.questions}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-green-600 font-semibold">Tổng số câu trả lời</p>
          <p className="text-2xl font-bold">{stats.total.answers}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-yellow-600 font-semibold">Tổng số bình luận</p>
          <p className="text-2xl font-bold">{stats.total.comments}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-600 font-semibold">
            Trung bình câu trả lời/câu hỏi
          </p>
          <p className="text-2xl font-bold">{averageAnswersPerQuestion}</p>
        </div>
      </div>

      <div className="h-96">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top" as const,
              },
              title: {
                display: true,
                text: "Hoạt động diễn đàn theo tháng",
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
      <TopContributors />
    </div>
  );
};

export default ForumStats;
