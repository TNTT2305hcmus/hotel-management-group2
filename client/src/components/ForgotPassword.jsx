import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Forgot.css";

//==============================XÓA KHI CÀI ĐẶT ===============================
// API giả lập
import { sendOtpApi, verifyOtpApi } from "../temp/mockApi"; 
//==============================XÓA KHI CÀI ĐẶT ===============================

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState(""); 
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);     // Loading cho nút Gửi
  const [isVerifying, setIsVerifying] = useState(false); // Loading cho nút Verify
  // --- Send OTP ---
  const handleSendOtp = async () => {
    if (!phone) {
      setError("Please enter phone number!"); 
      return;
    }

    setIsSending(true);
    setError("");

    try {
      // Gọi API gửi OTP (Giả lập)
      const res = await sendOtpApi(phone);
      
      if (res.success) {
         setOtpSent(true);
         setMessage(res.message); // Có thể giữ alert hoặc làm thông báo xanh
      }
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setIsSending(false);
    }
  };

  // --- Verify OTP ---
  const handleVerify = async () => {
    if (!otp) {
      setError("Please enter OTP!");
      return;
    }

    setIsVerifying(true);
    setMessage("");
    setError("");

    try {
//==========================XÓA KHI CÓ BACKEND ===============================
      // Gọi API Verify (Giả lập)
      const res = await verifyOtpApi(phone, otp); //Thay bằng API từ backend khi có
//==========================XÓA KHI CÓ BACKEND ===============================

      if (res.success) {
        localStorage.setItem("resetToken", res.token);
        
        setMessage("OTP Verified!");
        navigate("/reset-password");
      }
    } catch (err) {
      setError(err.message || "Invalid OTP");
    } finally {
      // setIsLoading(false);
      setIsVerifying(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <span className="back-btn" onClick={() => navigate("/login")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </span>
        <h2>Reset your password</h2>

        {/* Hiển thị lỗi ngay trên form */}
        {message && <p style={{color: "green", textAlign: "center", fontSize: "14px", marginBottom: "10px"}}>{message}</p>}
        {error && <p style={{color: "red", textAlign: "center", fontSize: "14px"}}>{error}</p>}

        <label>Phone</label>
        <div className="input-with-button">
          <input
            type="text"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={otpSent || isSending} // Khóa khi đang load hoặc đã gửi
          />
          <button 
            className="send-otp-btn" 
            onClick={handleSendOtp}
            disabled={isSending || otpSent}
          >
            {isSending ? "Sending..." : (otpSent ? "Sent" : "Send OTP")}
          </button>
        </div>

        <label>OTP</label>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          disabled={!otpSent || isSending}
        />
        <button 
            className="verify-btn" 
            onClick={handleVerify}
            disabled={!otpSent || isVerifying}
        >
            {isVerifying ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
}
