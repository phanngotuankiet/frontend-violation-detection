import React from "react";
import User from "../../../constant/User";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "../../../components/pagination/Pagination";
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface ListUserProps {
  users: User[];
  onEditUser: (user: User) => void;
  onDeleteUser?: (id: number) => void;
  setIdToDelete: (id: number) => void;
  setIsAddUserModalOpen: (isOpen: boolean) => void;
  isLoading: boolean;
  pagination: PaginationProps;
}
const ListUser: React.FC<ListUserProps> = ({
  users,
  onEditUser,
  setIdToDelete,
  setIsAddUserModalOpen,
  isLoading,
  pagination,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 transform transition-all mt-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Danh sách người dùng
        </h2>
        <button
          onClick={() => setIsAddUserModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Thêm người dùng
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 tracking-wider border-b ">
                Họ Tên
              </th>
              <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 tracking-wider border-b">
                Email
              </th>
              <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 tracking-wider border-b">
                Vai Trò
              </th>
              <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 tracking-wider border-b">
                Thao Tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        user.role === "admin"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-3">
                    <button
                      onClick={() => onEditUser(user)}
                      className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      Sửa
                    </button>
                    {user.role !== "admin" && (
                      <button
                        onClick={() => setIdToDelete(user.id)}
                        className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                      >
                        Xóa
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  Không có người dùng nào đang sử dụng hệ thống
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* <div className="flex items-center justify-center space-x-1 mt-4">
        <button
          onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          className={`px-3 py-1 rounded-md text-sm font-medium
            ${
              pagination.currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
        >
          Trước
        </button>

        <div className="flex items-center space-x-1">
          {getPageRange().map((page, index) => (
            <button
              key={index}
              onClick={() =>
                typeof page === "number" && pagination.onPageChange(page)
              }
              disabled={page === "..."}
              className={`px-3 py-1 rounded-md text-sm font-medium
                ${
                  typeof page === "number" && page === pagination.currentPage
                    ? "bg-blue-600 text-white"
                    : page === "..."
                    ? "text-gray-500"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
          className={`px-3 py-1 rounded-md text-sm font-medium
            ${
              pagination.currentPage === pagination.totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
        >
          Sau
        </button>
      </div> */}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={pagination.onPageChange}
      />
    </div>
  );
};

export default ListUser;
