import { axiosClient } from "../api/axiosClient";

// Lưu ý: Đảm bảo Server bạn đang chạy route dạng: http://localhost:8888/auth/login

// Register: /api/auth/register
export const registerAPI = (data) => {
  return axiosClient.post("/api/auth/register", data);
};

// Login: /api/auth/login
export const loginAPI = (data) => {
  return axiosClient.post("/api/auth/login", data);
};

// Forgot Password: /api/auth/forgot-password
export const sendOtpAPI = (email) => {
  return axiosClient.post("/api/auth/forgot-password", { email });
};

// Reset Password: /api/auth/reset-password
export const resetPasswordAPI = (email, otp, newPassword) => {
  return axiosClient.post("/api/auth/reset-password", { 
    email, 
    otp, 
    newPassword 
  });
};