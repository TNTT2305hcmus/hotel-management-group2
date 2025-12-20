export const sendOtpApi = (phone) => {
  return new Promise((resolve, reject) => {
    console.log(`Sending OTP to ${phone}...`);
    setTimeout(() => {
      // Giả lập: Nếu số điện thoại có 10 chữ số là hợp lệ
      if (phone.length >= 10) {
        resolve({ success: true, message: "OTP has been sent!" });
      } else {
        reject({ success: false, message: "Invalid phone number" });
      }
    }, 1500); // Giả lập mạng chậm 1.5s
  });
};

export const verifyOtpApi = (phone, otp) => {
  return new Promise((resolve, reject) => {
    console.log(`Verifying OTP: ${otp} for ${phone}...(123456 is correct)`);
    setTimeout(() => {
      // Giả lập: OTP đúng là "123456"
      if (otp === "123456") {
        resolve({ success: true, token: "reset-token-xyz" });
      } else {
        reject({ success: false, message: "Incorrect OTP" });
      }
    }, 1000);
  });
};

export const loginApi = (username, password, selectedRole) => {
  return new Promise((resolve, reject) => {
    console.log("Login check:", username, password, selectedRole); // In ra để debug

    setTimeout(() => {
      // Điều kiện: Phải nhập cả user và pass mới thành công
      if (username && password) {
        resolve({
          status: 200,
          data: {
            token: "jwt-token-123",
            user: { 
                name: username, 
                role: selectedRole,
            },
            requireOtp: false 
          }
        });
      } else {
        reject({ message: "Vui lòng nhập đầy đủ Tên đăng nhập và Mật khẩu!" });
      }
    }, 1000);
  });
};

export const resetPasswordApi = (token, newPassword) => {
  return new Promise((resolve, reject) => {
    console.log(`[MockAPI] Đổi mật khẩu cho token [${token}] thành: ${newPassword}`);
    
    setTimeout(() => {
      // Giả lập luôn thành công để test giao diện
      resolve({
        success: true,
        message: "Password changed successfully!"
      });
    }, 1500); // Đợi 1.5s để thấy hiệu ứng "Saving..."
  });
};