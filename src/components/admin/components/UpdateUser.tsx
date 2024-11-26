import axios from "axios";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import User from "../../../constant/User";

const backend = import.meta.env.VITE_BACKEND_URL;

interface UpdateUserProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onCancel: () => void;
}

const UpdateUser: React.FC<UpdateUserProps> = ({
  user,
  onUpdateUser,
  onCancel,
}) => {
  // Lưu trữ dữ liệu người dùng đang được chỉnh sửa
  const [editUser, setEditUser] = useState<User>(user);

  // Cập nhật lại thông tin người dùng nếu prop `user` thay đổi
  useEffect(() => {
    setEditUser(user);
  }, [user]);

  // Hàm xử lý cập nhật người dùng
  const handleUpdateUser = async () => {
    if (editUser) {
      try {
        const response = await axios.put(
          `${backend}/admin/update-user/${editUser.id}`,
          editUser
        );
        const updatedUser = response.data;
        onUpdateUser(updatedUser); // Truyền dữ liệu người dùng đã cập nhật lại cho component cha
        toast.warning("Update Information User Successfully !");
        onCancel(); // Đóng form chỉnh sửa
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  return (
    <div>
      {editUser && (
        <div className="bg-white shadow-md p-6 rounded-lg mb-6 relative">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Edit User
          </h2>

          <FontAwesomeIcon
            icon={faX}
            className="absolute top-4 right-3 cursor-pointer"
            onClick={onCancel}
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
    </div>
  );
};

export default UpdateUser;
