// import ForumStats from "./ForumStats";
// import SensitiveStats from "./SensitiveStat";
// import UserStats from "./UserStats";

// const AllStats = () => {
//   return (
//     <div className="bg-white rounded-2xl shadow-2xl p-8 transform transition-all mt-4">
//       <UserStats />
//       <ForumStats />
//       <SensitiveStats />
//     </div>
//   );
// };
// export default AllStats;

import React, { useState } from "react";
import UserStats from "./UserStats";
import ForumStats from "./ForumStats";
import SensitiveStats from "./SensitiveStat";

const AllStats = () => {
  const [activeTab, setActiveTab] = useState<"users" | "forum" | "sensitive">(
    "users"
  );

  const tabConfig = [
    { id: "users", label: "Thống kê người dùng", component: UserStats },
    { id: "forum", label: "Thống kê diễn đàn", component: ForumStats },
    {
      id: "sensitive",
      label: "Thống kê tìm kiếm nhạy cảm",
      component: SensitiveStats,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Thống Kê Hệ Thống
          </h1>
        </div>

        {/* Tab Buttons */}
        <div className="flex space-x-4 mb-6">
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors
                ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {tabConfig.map(
            (tab) =>
              activeTab === tab.id && (
                <div key={tab.id}>
                  <tab.component />
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default AllStats;
