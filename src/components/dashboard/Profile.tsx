/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { format } from "date-fns";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Navbar from "./Navbar";
import { userService } from "../../../api/user.service";
import { toast } from "react-toastify";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    createdAt: new Date(),
  });
  const [editedName, setEditedName] = useState(userData.fullName);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await userService.getProfile();
        setUserData({
          fullName: data.name || "",
          email: data.email,
          createdAt: new Date(data.createdAt),
        });
        setEditedName(data.name || "");
      } catch (error: any) {
        setError("Không thể tải thông tin người dùng");
      }
    };

    fetchUserProfile();
  }, []);

  const handleEdit = async () => {
    if (isEditing) {
      setLoading(true);
      setError("");

      try {
        const updatedUser = await userService.updateName(editedName);
        setUserData((prev) => ({
          ...prev,
          fullName: updatedUser.name || "", // Cập nhật từ response
        }));
        // Thông báo thành công (optional
        toast.success("Cập nhật thông tin thành công");
      } catch (error: any) {
        if (error.response?.status === 404) {
          setError("Không tìm thấy người dùng");
        } else if (error.response?.status === 401) {
          setError("Phiên đăng nhập hết hạn");
        } else {
          setError(
            error.response?.data?.message ||
              "Có lỗi xảy ra khi cập nhật thông tin"
          );
        }
        return;
      } finally {
        setLoading(false);
      }
    }
    setIsEditing(!isEditing);
  };

  return (
    <>
      <Navbar isAdmin={false}/>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
              {error}
            </div>
          )}

          <div className="relative">
            <div className="h-48 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 rounded-t-3xl overflow-hidden">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: "24px 24px",
                }}
              ></div>
            </div>

            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 -mt-20 mx-4 relative z-10">
              <div className="flex flex-col items-center -mt-16">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full p-1">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                        {userData.fullName.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <button
                    className="absolute bottom-0 right-0 bg-white/90 backdrop-blur-lg rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300"
                    aria-label="Change profile picture"
                  >
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Họ và tên
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  ) : (
                    <p className="text-xl font-semibold text-gray-800">
                      {userData.fullName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <p className="text-xl text-gray-800 font-medium">
                    {userData.email}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Ngày tham gia
                  </label>
                  <p className="text-xl text-gray-800 font-medium">
                    {format(userData.createdAt, "dd MMMM, yyyy")}
                  </p>
                </div>

                <button
                  onClick={handleEdit}
                  disabled={loading}
                  className={`w-full group bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl px-8 py-3 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-300 ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isEditing ? (
                    <>
                      <SaveIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                      <span>{loading ? "Đang lưu..." : "Lưu thay đổi"}</span>
                    </>
                  ) : (
                    <>
                      <EditIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                      <span>Chỉnh sửa</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
