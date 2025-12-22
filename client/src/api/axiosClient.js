import axios from "axios";

// 1. Tạo instance
export const axiosClient = axios.create({
  // URL Backend của bạn. Nếu chạy local thì là http://localhost:5000
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Interceptor REQUEST: Tự động gắn Token vào Header
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

// 3. Interceptor RESPONSE: Xử lý khi Token hết hạn (Lỗi 401)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ -> Xóa token và đá về Login
      localStorage.removeItem("hm_token");
      // Dùng window.location để force reload trang về login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);