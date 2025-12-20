import axiosClient from "../api/axiosClient";

// Đăng nhập
export const loginAPI = (data) => {
  return axiosClient.post("/auth/login", data);
};

// Gửi OTP 
export const sendOtpAPI = (phone) => {
  return axiosClient.post("/auth/send-otp", { phone });
};

// Xác thực OTP 
export const verifyOtpAPI = (phone, otp) => {
  return axiosClient.post("/auth/verify-otp", { phone, otp });
};

// Đổi mật khẩu mới
export const resetPasswordAPI = (token, password) => {
  return axiosClient.post("/auth/reset-password", { 
    token, 
    newPassword: password 
  });
};