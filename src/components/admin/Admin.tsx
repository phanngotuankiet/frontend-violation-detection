import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddUserComponent from "./components/AddUser";
import UpdateUser from "./components/UpdateUser";
import ListUser from "./components/ListUser";

import { toast } from "react-toastify";
import User from "../../constant/User";

const SuperAdmin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editUser, setEditUser] = useState<User | null>(null);
  const backend = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  // Fetch users từ backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${backend}/admin/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  // luôn gọi api user list
  useEffect(() => {
    fetchUsers();
  }, []);

  // Hàm xóa người dùng
  const handleDeleteUser = async (id: number) => {
    if (!id || isNaN(id)) {
      console.error("Invalid user id");
      return;
    }
    try {
      await axios.delete(`${backend}/admin/delete-user/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      toast.error("Delete User Successfully !");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Hàm chỉnh sửa người dùng
  const handleEditUser = (user: User) => {
    setEditUser(user);
  };

  // Hàm đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("email");
    navigate("/login");
  };

  // Hàm thêm người dùng mới
  const handleAddUser = (newUser: User) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <div className="container mx-auto max-w-6xl bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-end mb-6">
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            Log Out
          </button>
        </div>
        <h1 className="text-3xl font-semibold text-center text-green-600 mb-8">
          Super Admin Dashboard
        </h1>

        <AddUserComponent onAddUser={handleAddUser} />

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
        />
      </div>
    </div>
  );
};

export default SuperAdmin;
