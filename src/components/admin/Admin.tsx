/* eslint-disable @typescript-eslint/no-explicit-any */
import { faSignOutAlt, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const SuperAdmin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "user" });
  const [editUser, setEditUser] = useState<User | null>(null);
  const backend = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${backend}/admin/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (newUser.name && newUser.email) {
      try {
        const response = await axios.post(`${backend}/admin/add-user`, newUser);
        const addedUser = response.data;
        setUsers([...users, addedUser]);
        setNewUser({ name: "", email: "", role: "user" });
      } catch (error) {
        console.error("Error adding user:", error);
      }
    }
  };

  // Handle delete user
  const handleDeleteUser = async (id: number) => {
    if (!id || isNaN(id)) {
      console.error("Invalid user id");
      return;
    }
    try {
      await axios.delete(`${backend}/admin/delete-user/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error: any) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEditUser = (user: User) => {
    setEditUser(user);
  };

  const handleUpdateUser = async () => {
    if (editUser) {
      try {
        const response = await axios.put(
          `${backend}/admin/update-user/${editUser.id}`,
          editUser
        );
        const updatedUser = response.data;
        setUsers(
          users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        );
        setEditUser(null);
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("email");

    // Điều hướng về trang đăng nhập
    navigate("/login");
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

        <div className="bg-white shadow-md p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Add New User
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={handleAddUser}
              className="col-span-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Add User
            </button>
          </div>
        </div>

        {/* Phần chỉnh sửa người dùng */}
        {editUser && (
          <div className="bg-white shadow-md p-6 rounded-lg mb-6 relative">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Edit User
            </h2>

            <FontAwesomeIcon
              icon={faX}
              className="absolute top-4 right-3 cursor-pointer"
              onClick={() => setEditUser(null)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={editUser.name}
                onChange={(e) =>
                  setEditUser({ ...editUser, name: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="email"
                value={editUser.email}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <select
                value={editUser.role}
                onChange={(e) =>
                  setEditUser({ ...editUser, role: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button
                onClick={handleUpdateUser}
                className="col-span-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Update User
              </button>
            </div>
          </div>
        )}

        {/* Phần hiển thị bảng người dùng */}
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            User List
          </h2>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left text-gray-600">Name</th>
                <th className="px-4 py-2 text-left text-gray-600">Email</th>
                <th className="px-4 py-2 text-left text-gray-600">Role</th>
                <th className="px-4 py-2 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2 text-gray-800">{user.name}</td>
                  <td className="px-4 py-2 text-gray-800">{user.email}</td>
                  <td className="px-4 py-2 text-gray-800">{user.role}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="bg-yellow-500 text-white py-2 px-4 rounded-md mr-2 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdmin;
