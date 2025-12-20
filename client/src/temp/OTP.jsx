import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css"; // Tận dụng lại CSS của Login cho đẹp

//========================================XÓA KHI CÓ BACKEND=========================================
// API giả lập
import { sendOtpApi, verifyOtpApi } from "./mockApi"; 
//========================================XÓA KHI CÓ BACKEND==========================================

const OTP = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false); // Trạng thái: Đã gửi OTP hay chưa
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Gửi OTP
  const handleSendOtp = async () => {
    if (!phone) {
      setError("Please enter your phone number.");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      // Gọi API gửi OTP (gia lập)
      const res = await sendOtpApi(phone);
      
      if (res.success) {
        setOtpSent(true);
        setMessage("OTP has been sent to your phone.");
      }
    } catch (err) {
      setError(err.message || "Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  // Xác thực OTP
  const handleVerify = async () => {
    if (!otp) {
      setError("Please enter the OTP code.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Gọi API verify
      const res = await verifyOtpApi(phone, otp); 

      if (res.success) {
        // Lưu token reset password tạm thời
        localStorage.setItem("resetToken", res.token);
        
        // Chuyển hướng sang trang đặt mật khẩu mới
        navigate("/reset-password");
      }
    } catch (err) {
      setError(err.message || "Invalid OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm reset để nhập lại số điện thoại
  const handleReset = () => {
    setOtpSent(false);
    setOtp("");
    setError("");
    setMessage("");
  };

  return (
    <div className="login-container">
      {/* Container chính giống Login */}
      <div className="login-card" style={{ width: 400 }}> {/* Giữ width 400 như bạn muốn */}
        <h2>OTP Verification</h2>
        
        <p style={{ fontSize: 14, color: "#666", marginBottom: 20, textAlign: "center" }}>
          {otpSent 
            ? `OTP has been sent to ${phone}`
            : "Enter your phone number to receive the verification code"} {/* Tiếng Anh */}
        </p>

        {/* Hiển thị thông báo lỗi hoặc thành công */}
        {error && <div style={{ color: "red", marginBottom: 10, fontSize: 14, textAlign: "center" }}>{error}</div>}
        {message && <div style={{ color: "green", marginBottom: 10, fontSize: 14, textAlign: "center" }}>{message}</div>}

        {/* Trường hợp chưa gửi mã OTP thì chỉ hiện form sđt*/}
        {!otpSent ? (
          <div className="form-group" style={{ width: "100%" }}>
            <label>Phone Number</label>
            <input
              type="text"
              placeholder="Ex: 0912345678" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
              style={{ width: "100%", boxSizing: "border-box" }}
            />
            <button 
              className="login-btn" 
              onClick={handleSendOtp}
              disabled={isLoading}
              style={{ marginTop: 15 }}
            >
              {isLoading ? "Sending..." : "Send OTP"} 
            </button>
            
            {/* Nút quay về đăng nhập */}
            <div style={{ textAlign: "center", marginTop: 15 }}>
                <span 
                    style={{ cursor: "pointer", color: "#007bff", fontSize: 14 }} 
                    onClick={() => navigate("/login")}
                >
                    Back to Login 
                </span>
            </div>
          </div>
        ) : (
          /* Trường hợp đã gửi OTP thì hiện form OTP */
          <div className="form-group" style={{ width: "100%" }}>
            <label>Enter OTP (Hint: 123456)</label>
            <input
              type="text"
              placeholder="6 digits" 
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={isLoading}
              style={{ width: "100%", boxSizing: "border-box" }}
            />
            
            <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
               {/* Nút quay lại */}
              <button 
                type="button"
                className="login-btn"
                style={{ backgroundColor: "#ccc", color: "#333" }}
                onClick={handleReset} 
                disabled={isLoading}
              >
                Re-enter Phone
              </button>
              
              {/* Nút xác nhận */}
              <button 
                className="login-btn" 
                onClick={handleVerify}
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify"} 
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OTP;