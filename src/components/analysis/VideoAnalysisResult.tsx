import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AnalysisResultProps {
  confidences: {
    [key: string]: number;
  };
  detectedCrimes: string[];
}

const LABELS = {
  "arrest": "Bắt giữ",
  "assault": "Hành hung",
  "explosion": "Nổ",
  "fighting": "Đánh nhau",
  "normal videos": "Video bình thường",
  "road accidents": "Tai nạn giao thông",
  "robbery": "Cướp",
  "shooting": "Nổ súng",
  "vandalism": "Phá hoại"
} as const;

const VideoAnalysisResult: React.FC<AnalysisResultProps> = ({
  confidences,
  detectedCrimes
}) => {
  const chartData = {
    labels: Object.keys(confidences).map(key => LABELS[key as keyof typeof LABELS] || key),
    datasets: [
      {
        label: 'Độ tin cậy (%)',
        data: Object.values(confidences).map(value => value * 100),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Kết quả Phân tích Bạo lực',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Kết quả Phân tích Video
      </h2>
      
      <div className="mb-8">
        <Bar data={chartData} options={chartOptions} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3 text-gray-700">Các hành vi được phát hiện:</h3>
          <ul className="space-y-2">
            {detectedCrimes.map((crime) => (
              <li key={crime} className="flex items-center text-gray-600">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                {LABELS[crime as keyof typeof LABELS] || crime}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3 text-gray-700">Thống kê chi tiết:</h3>
          <div className="space-y-2">
            {Object.entries(confidences).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-gray-600">{LABELS[key as keyof typeof LABELS] || key}:</span>
                <span className="font-medium">{(value * 100).toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoAnalysisResult; 