import axios from 'axios';
import { isTokenExpired } from '../src/utils/token';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// Tạo instance axios với config mặc định
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor để kiểm tra token trước mỗi request
axiosInstance.interceptors.request.use(async (config) => {
  // Lấy access token từ localStorage
  const accessToken = localStorage.getItem("access_token");
  
  if (!accessToken) {
    return config;
  }

  // Kiểm tra token có hết hạn chưa
  if (isTokenExpired(accessToken)) {
    console.log("token expired");
    // Nếu hết hạn thì lấy refresh token để renew access token
    const refreshToken = localStorage.getItem("refresh_token");
    
    // Nếu không có refresh token hoặc refresh token cũng hết hạn
    if (!refreshToken || isTokenExpired(refreshToken)) {
      // Logout và báo lỗi
      localStorage.clear();
      window.location.href = '/login';
      throw new Error('Phiên đăng nhập hết hạn');
    }

    try {
      // Gọi API lấy token mới
      const response = await axios.post(`${API_URL}/auth/refresh`, {
        refresh_token: refreshToken
      });
      
      const newAccessToken = response.data.access_token;
      
      // Lưu token mới vào localStorage
      localStorage.setItem('access_token', newAccessToken);
      
      // Gắn token mới vào header
      config.headers.Authorization = `Bearer ${newAccessToken}`;

      console.log("token renewed");
    } catch (error: any) {
      // Nếu refresh token fail thì logout
      window.location.href = '/login';
      throw new Error('Không thể làm mới phiên đăng nhập');
    }
  } else {
    // Nếu token còn hạn thì dùng bình thường
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export default axiosInstance;