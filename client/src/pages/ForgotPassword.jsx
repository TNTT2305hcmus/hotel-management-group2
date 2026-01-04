import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/ForgotPassword.css";
import { sendOtpAPI, verifyOtpAPI } from "../services/authService";

export default function ForgotPassword() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  
  // Trạng thái UI
  const [otpSent, setOtpSent] = useState(false); // Đã gửi OTP chưa?
  const [loading, setLoading] = useState(false); // Đang gọi API?
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Countdown cho việc gửi lại OTP
  const [countdown, setCountdown] = useState(0); 

  // Effect để chạy đồng hồ đếm ngược
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // --- 1. Gửi OTP ---
  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter your email address!");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await sendOtpAPI(email);
      setOtpSent(true);
      
      // Mock log (xóa khi production)
      if(res.data?.mockOtp) {
          setMessage(`OTP sent! (Mock: ${res.data.mockOtp})`);
      } else {
          setMessage(`OTP has been sent to ${email}`);
      }
      
      // Reset countdown về 0 để người dùng có thể gửi lại nếu muốn (hoặc set 60s tùy ý)
      setCountdown(60); 

    } catch (err) {
      const msg = err.response?.data?.error || "Failed to send OTP.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. Xác thực OTP & Chuyển trang ---
  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Gọi API Verify OTP
      await verifyOtpAPI(email, otp);

      // Nếu thành công (không nhảy vào catch):
      // Chuyển sang trang ResetPassword, mang theo Email và OTP (để dùng cho bước cuối)
      navigate("/reset-password", { state: { email, otp } });

    } catch (err) {
      const msg = err.response?.data?.error || "Invalid OTP.";
      setError(msg);

      // Yêu cầu: "Nếu OTP sai... đợi 10s đếm ngược thì cho phép bấm nút sendOTP lại"
      // Logic: Nếu sai, ta set countdown = 10. Trong lúc countdown > 0, nút Send OTP sẽ bị disable
      setCountdown(10);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <span className="back-btn" onClick={() => navigate("/login")}>Back</span>
        <h2>Reset Password</h2>

        {message && <p className="success-msg" style={{color: "green", textAlign: "center"}}>{message}</p>}
        {error && <p className="error-msg" style={{color: "red", textAlign: "center"}}>{error}</p>}

        {/* Input Email */}
        <label>Email Address</label>
        <div className="input-with-button">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // Nếu đã gửi OTP rồi thì disable ô email để tránh sửa đổi
            disabled={otpSent || loading} 
          />
          
          {/* Nút Send OTP nằm trong ô input hoặc ngay cạnh */}
          <button 
            className="send-otp-btn" 
            onClick={handleSendOtp}
            // Disable khi: Đang loading HOẶC Đang đếm ngược
            disabled={loading || countdown > 0}
            style={{ 
                background: countdown > 0 ? "#ccc" : "#000",
                cursor: countdown > 0 ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "..." : (countdown > 0 ? `Wait ${countdown}s` : (otpSent ? "Resend" : "Send OTP"))}
          </button>
        </div>

        {/* Khu vực nhập OTP - Chỉ hiện khi đã gửi OTP thành công */}
        {otpSent && (
          <div className="otp-section" style={{ marginTop: "20px", animation: "fadeInUp 0.5s" }}>
            <label>Enter OTP Code</label>
            <input
              type="text"
              placeholder="6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={loading}
              maxLength={6}
            />

            <button 
                className="verify-btn" 
                onClick={handleVerifyOtp}
                disabled={loading}
            >
                {loading ? "Verifying..." : "Verify OTP & Continue"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}