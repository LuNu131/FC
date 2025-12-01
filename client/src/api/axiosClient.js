import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:3000/api" : "/api");

const axiosClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Gửi Token đi
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý lỗi trả về
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nếu gặp lỗi 401 (Unauthorized) -> Token sai/hết hạn
    if (error.response && error.response.status === 401) {
      console.warn("Token lỗi, đang đăng xuất...");
      // Xóa sạch localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Đá về trang login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
