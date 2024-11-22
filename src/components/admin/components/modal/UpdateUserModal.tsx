import axios from "axios";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import User from "../../../../constant/User";

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
  const [editUser, setEditUser] = useState<User>(user);

  useEffect(() => {
    setEditUser(user);
  }, [user]);

  const handleUpdateUser = async () => {
    if (editUser) {
      try {
        const response = await axios.put(
          `${backend}/admin/update-user/${editUser.id}`,
          editUser
        );
        const updatedUser = response.data;
        onUpdateUser(updatedUser);
        toast.success("Cập nhật thông tin thành công! 🎉");
        onCancel();
      } catch (error) {
        console.error("Lỗi khi cập nhật:", error);
        toast.error("Có lỗi xảy ra khi cập nhật!");
      }
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleUpdateUser();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl transform transition-all">
        {editUser && (
          <div className="relative">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                Chỉnh sửa thông tin người dùng
              </h2>
              <button
                onClick={onCancel}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <FontAwesomeIcon icon={faX} className="text-gray-600" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={editUser.name}
                    onChange={(e) =>
                      setEditUser({ ...editUser, name: e.target.value })
                    }
                    onKeyDown={handleKeyPress}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Nhập họ và tên"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editUser.email}
                    onChange={(e) =>
                      setEditUser({ ...editUser, email: e.target.value })
                    }
                    onKeyDown={handleKeyPress}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Nhập địa chỉ email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vai trò
                  </label>
                  <select
                    value={editUser.role}
                    onChange={(e) =>
                      setEditUser({ ...editUser, role: e.target.value })
                    }
                    onKeyDown={handleKeyPress}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="user">Người Dùng</option>
                    <option value="admin">Quản Trị Viên</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={onCancel}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-gray-50 transition-colors"
              >
                Hủy bỏ
              </button>

              <button
                onClick={handleUpdateUser}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateUser;
