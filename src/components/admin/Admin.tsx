import React, { useState, useEffect } from "react";
import axios from "axios";
import AddUser from "./components/AddUser";
import UpdateUser from "./components/modal/UpdateUserModal";
import ListUser from "./components/ListUser";
import { toast } from "react-toastify";
import User from "../../constant/User";
import OnDeleteModal from "./components/modal/OnDeleteModal";
import OnLogoutModal from "./components/modal/OnLogoutModal";
import Navbar from "../dashboard/Navbar";
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
    <div className="h-full w-full bg-gray-50">
      <Navbar isAdmin={true} />
      {/* Header */}

      {/* //Body */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 py-8 px-5 mt-4">
        <h1 className="text-3xl font-semibold text-center text-black mb-8">
          Super Admin Dashboard
        </h1>
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
    </div>
  );
};

export default SuperAdmin;
