/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface NavbarProps {
  isAdmin: boolean;
  setIsLogoutModalOpen?: (open: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAdmin, setIsLogoutModalOpen }) => {
  const { accessToken } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const { logout } = useAuth();

  const handleLogoutAdmin = () => {
    // logout();
    // setIsLoggedIn(false);
    // window.location.href = "/login";
    setIsLogoutModalOpen?.(true);
  };

  const handleLogoutUser = () => {
    logout();
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  useEffect(() => {
    setIsLoggedIn(!!accessToken);
  }, [accessToken]);

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 backdrop-blur-lg relative z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                  V
                </span>
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Violation<span className="text-blue-200">Detector</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            {isLoggedIn ? (
              isAdmin ? (
                <div className="relative">
                  <div className="flex items-center">
                    <Link
                      to="/superAdmin"
                      className="mr-6 text-blue-100 hover:text-white transition-colors"
                    >
                      Thống kê
                    </Link>
                    <Link
                      to="/superAdmin/users"
                      className="mr-6 text-blue-100 hover:text-white transition-colors"
                    >
                      Người dùng
                    </Link>
                    <Link
                      to="/superAdmin/forum"
                      className="mr-6 text-blue-100 hover:text-white transition-colors"
                    >
                      Diễn đàn
                    </Link>
                    <Link
                      to="/superAdmin/monitoring"
                      className="mr-6 text-blue-100 hover:text-white transition-colors"
                    >
                      Tìm kiếm không phù hợp
                    </Link>
                    <button
                      onClick={handleLogoutAdmin}
                      className="flex items-center px-6 py-3 text-sm font-medium rounded-xl text-red-600 bg-white hover:bg-red-50 transition-colors shadow-lg"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              ) : (
                // Hiển thị Navbar cho người dùng thông thường
                <div className="relative">
                  <div className="flex items-center">
                    <Link
                      to="/forum"
                      className="mr-6 text-blue-100 hover:text-white transition-colors"
                    >
                      Forum
                    </Link>
                    <Link
                      to="/evaluate"
                      className="mr-6 text-blue-100 hover:text-white transition-colors"
                    >
                      Phân tích
                    </Link>
                    <Link
                      to="/processedVideos"
                      className="mr-6 text-blue-100 hover:text-white transition-colors"
                    >
                      Lịch sử
                    </Link>
                    <button
                      onClick={() =>
                        setIsProfileDropdownOpen(!isProfileDropdownOpen)
                      }
                      className="flex items-center space-x-3 text-white focus:outline-none group"
                    >
                      <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <span className="text-white text-sm font-bold">U</span>
                      </div>
                    </button>
                  </div>

                  {isProfileDropdownOpen && (
                    <div className="origin-top-right absolute right-0 mt-3 w-56 rounded-2xl shadow-xl bg-white/90 backdrop-blur-lg ring-1 ring-black/5 border border-white/20 z-50">
                      <div className="py-2 divide-y divide-gray-100">
                        <div className="px-4 py-3">
                          <p className="text-sm text-gray-500">Xin chào</p>
                          {/* <p className="text-sm font-medium text-gray-900 truncate">
                            {email && email}
                          </p> */}
                        </div>
                        <div className="py-2">
                          <Link
                            to="/profile"
                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                          >
                            <span className="flex-1">Xem hồ sơ</span>
                          </Link>

                          <button
                            onClick={handleLogoutUser}
                            className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <span className="flex-1 text-center">
                              Đăng xuất
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-xl text-blue-600 bg-white hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
