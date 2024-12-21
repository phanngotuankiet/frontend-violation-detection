import React, { useState, useEffect } from "react";
import axios from "axios";
import AddUser from "./components/AddUser";
import UpdateUser from "./components/modal/UpdateUserModal";
import { toast } from "react-toastify";
import User from "../../constant/User";
import OnDeleteModal from "./components/modal/OnDeleteModal";
import OnLogoutModal from "./components/modal/OnLogoutModal";
import { adminService } from "../../../api/admin.service";
import AllStats from "./components/stats/AllStats";
import { useAuth } from "../../context/AuthContext";

const SuperAdmin: React.FC = () => {
  const { logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  const backend = import.meta.env.VITE_BACKEND_URL;

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

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  const handleAddUser = (newUser: User) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        {/* <div className="mb-8 sm:flex sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-bold text-gray-900">Thống kê</h1>
          </div>
        </div> */}

        {/* Main Content */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <AllStats />
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

      <OnLogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default SuperAdmin;
