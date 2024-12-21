import React, { useEffect, useState } from "react";
import User from "../../../constant/User";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "../../../components/pagination/Pagination";
import UserStats from "./stats/UserStats";
import axios from "axios";
import { toast } from "react-toastify";
import OnDeleteModal from "./modal/OnDeleteModal";
import UpdateUser from "./modal/UpdateUserModal";
import AddUser from "./AddUser";
import { adminService } from "../../../../api/admin.service";
import Navbar from "../../dashboard/Navbar";

const ListUser: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;
  const backend = import.meta.env.VITE_BACKEND_URL;
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const response = await adminService.getAllUsers(page, itemsPerPage);
      setUsers(response.data);
      setTotalPages(response.meta.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
      toast.error("Không thể tải danh sách người dùng");
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleDeleteUser = async (id: number) => {
    if (!id || isNaN(id)) {
      console.error("ID người dùng không hợp lệ");
      return;
    }
    try {
      await axios.delete(`${backend}/admin/delete-user/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      toast.success("Xóa người dùng thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      toast.error("Không thể xóa người dùng");
    }
  };

  const handleEditUser = (user: User) => {
    setEditUser(user);
  };

  const handleAddUser = (newUser: User) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await adminService.searchUsers(searchTerm, currentPage, itemsPerPage);
      setUsers(response.data);
      setTotalPages(response.meta.totalPages); 
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      toast.error("Không thể tìm kiếm người dùng");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        {/* <div className="mb-8 sm:flex sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-bold text-gray-900">
              User Management
            </h1>
          </div>
        </div> */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
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

            {/* Search Bar */}
            <div className="flex gap-2 mb-6">
              <div className="flex-1">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm theo email hoặc tên..."
                    className="w-1/4 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
                  >
                    <FontAwesomeIcon icon={faSearch} className="mr-2" />
                    Tìm kiếm
                  </button>
                </form>
              </div>
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
                            onClick={() => handleEditUser(user)}
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
                      <td
                        colSpan={4}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        Không có người dùng nào đang sử dụng hệ thống
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />

            {/* <UserStats /> */}
          </div>
        </div>
      </div>
      {/* Modals */}
      {isAddUserModalOpen && (
        <AddUser
          onAddUser={handleAddUser}
          onClose={() => setIsAddUserModalOpen(false)}
          isOpen={isAddUserModalOpen}
        />
      )}

      {editUser && (
        <UpdateUser
          user={editUser}
          onUpdateUser={(updatedUser) => {
            setUsers(
              users.map((user) =>
                user.id === updatedUser.id ? updatedUser : user
              )
            );
            setEditUser(null);
          }}
          onCancel={() => setEditUser(null)}
        />
      )}

      <OnDeleteModal
        isOpen={idToDelete !== null}
        onClose={() => setIdToDelete(null)}
        onConfirm={() => {
          if (idToDelete !== null) {
            handleDeleteUser(idToDelete);
            setIdToDelete(null);
          }
        }}
        userName={users.find((user) => user.id === idToDelete)?.name || ""}
      />
    </div>
  );
};

export default ListUser;
