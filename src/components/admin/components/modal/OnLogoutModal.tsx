import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

interface OnLogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const OnLogoutModal: React.FC<OnLogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mt-96"
      onClick={handleOverlayClick}
    >
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl transform transition-all">
        <div className="relative p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <FontAwesomeIcon
                icon={faSignOutAlt}
                className="h-8 w-8 text-red-600"
              />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Xác nhận đăng xuất
            </h3>

            <p className="text-gray-600 mb-8">
              Bạn có chắc chắn muốn đăng xuất?
            </p>

            <div className="flex justify-center space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
              >
                Huỷ bỏ
              </button>

              <button
                onClick={onConfirm}
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnLogoutModal;
