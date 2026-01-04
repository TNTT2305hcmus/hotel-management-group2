import axios from "axios";

// Tạo instance
export const axiosClient = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor REQUEST: Tự động gắn Token vào Header
axiosClient.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage (phải trùng tên key bên AuthContext)
    const token = localStorage.getItem("hm_token"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor RESPONSE: Xử lý khi Token hết hạn (Lỗi 401)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/api/auth/login');
    const hasToken = localStorage.getItem("hm_token");

    if (error.response?.status === 401 && !isLoginRequest && hasToken) {
      // Token hết hạn hoặc không hợp lệ -> Xóa token và đá về Login
      localStorage.removeItem("hm_token");
      // Dùng window.location để force reload trang về login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);