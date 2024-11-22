import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faEnvelope,
  faUserShield,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import User from "../../../constant/User";

const backend = import.meta.env.VITE_BACKEND_URL;

interface AddUserProps {
  onAddUser: (newUser: User) => void;
  onClose: () => void;
  isOpen: boolean;
}

const AddUser: React.FC<AddUserProps> = ({ onAddUser, onClose, isOpen }) => {
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "user" });

  const handleAddUser = async () => {
    if (newUser.name && newUser.email) {
      try {
        const response = await axios.post(`${backend}/admin/add-user`, newUser);
        const addedUser = response.data;
        onAddUser(addedUser);
        setNewUser({ name: "", email: "", role: "user" });
        toast.success("✨ Thêm người dùng thành công!", {
          position: "top-right",
          autoClose: 3000,
        });
        onClose();
      } catch {
        toast.error("❌ Có lỗi xảy ra khi thêm người dùng", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddUser();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleOverlayClick}>
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl transform transition-all">
        <div className="relative">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">
              Thêm người dùng mới
            </h2>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <FontAwesomeIcon icon={faX} className="text-gray-600" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <FontAwesomeIcon
                  icon={faUserPlus}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400"
                />
                <input
                  type="text"
                  placeholder="Họ và tên"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  onKeyDown={handleKeyPress}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="relative">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  onKeyDown={handleKeyPress}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="relative">
                <FontAwesomeIcon
                  icon={faUserShield}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400"
                />
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  onKeyDown={handleKeyPress}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="user">👤 Người Dùng</option>
                  <option value="admin">👑 Quản Trị Viên</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-gray-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleAddUser}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Thêm người dùng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
