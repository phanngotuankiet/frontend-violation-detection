import React, { useState, useEffect } from "react";
import axios from "axios";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddUser from "./components/AddUser";
import UpdateUser from "./components/modal/UpdateUserModal";
import ListUser from "./components/ListUser";
import { toast } from "react-toastify";
import User from "../../constant/User";
import OnDeleteModal from "./components/modal/OnDeleteModal";
import OnLogoutModal from "./components/modal/OnLogoutModal";

const SuperAdmin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const backend = import.meta.env.VITE_BACKEND_URL;

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${backend}/admin/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
      toast.error("Không thể tải danh sách người dùng");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("email");
    window.location.href = "/login";
  };

  const handleAddUser = (newUser: User) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 py-8 px-5">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">
              Bảng Điều Khiển Quản Trị Viên
            </h1>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="bg-white/10 backdrop-blur-lg text-white py-2.5 px-4 rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>

      <AddUser
        onAddUser={handleAddUser}
        onClose={() => setIsAddUserModalOpen(false)}
        isOpen={isAddUserModalOpen}
      />

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

      <ListUser
        users={users}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        setIdToDelete={setIdToDelete}
        setIsAddUserModalOpen={setIsAddUserModalOpen}
      />

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
