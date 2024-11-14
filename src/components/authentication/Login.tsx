/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../../api/auth.service";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { setAccessToken, setEmail } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.login(formData);
      if (response.access_token) {
        const roleUser = response.user.role;
        if (roleUser === "user") {
          setAccessToken(response.access_token);
          setEmail(response.email);
          navigate("/evaluate");
        } else if (roleUser === "admin") {
          setAccessToken(response.access_token);
          setEmail(response.email);
          navigate("/superAdmin");
        }
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setError("Người dùng không tồn tại");
      } else if (error.response?.status === 401) {
        setError("Email hoặc mật khẩu không chính xác");
      } else {
        setError("Có lỗi xảy ra. Vui lòng thử lại sau");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full min-w-full">
      {/* Bên trái - Hình ảnh/Banner */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 p-12 text-white items-center justify-center">
        <div className="max-w-xl">
          <h2 className="text-4xl font-bold mb-6">
            Chào mừng đến với Nền tảng của Chúng tôi
          </h2>
          <p className="text-xl">
            Hệ thống dự đoán và phòng chống tội phạm an toàn, nhanh chóng và
            đáng tin cậy.
          </p>
        </div>
      </div>

      {/* Bên phải - Form đăng nhập */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Chào mừng trở lại
            </h1>
            <p className="text-gray-600">
              Đăng nhập để tiếp tục hành trình của bạn
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Nhập email của bạn"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit(e);
                    }
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Nhập mật khẩu của bạn"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit(e);
                    }
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="flex items-center justify-end">
                <a
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Quên mật khẩu?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-4 rounded-xl font-semibold transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${
                  loading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-blue-700"
                }`}
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Chưa có tài khoản?{" "}
            <a
              href="/signup"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Tạo tài khoản
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
