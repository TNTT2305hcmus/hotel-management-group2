import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/ForgotPassword.css";
import { sendOtpAPI } from "../services/authService";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState(""); 
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  // --- Send OTP ---
  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter your email address!"); 
      return;
    }

    setIsSending(true);
    setError("");
    setMessage("");

    try {
      // Gọi API backend: /api/auth/forgot-password
      const res = await sendOtpAPI(email);
      
      // Backend trả về status 200 là thành công
      setOtpSent(true);
      // Backend mock OTP trả về trong res.data.mockOtp (chỉ để test)
      // Thực tế bạn check console log của Server để lấy OTP
      setMessage(`OTP sent to ${email}. Check server console!`);
      
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to send OTP. Email might not exist.";
      setError(msg);
    } finally {
      setIsSending(false);
    }
  };

  // --- Verify & Next Step ---
  const handleVerify = () => {
    if (!otp) {
      setError("Please enter the OTP!");
      return;
    }
    // Ở đây ta chưa gọi API verify ngay, mà chuyển OTP + Email sang trang Reset
    // Vì API resetPassword của backend cần cả 3 thứ: Email, OTP, NewPass
    navigate("/reset-password", { state: { email, otp } });
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <span className="back-btn" onClick={() => navigate("/login")}>Back</span>
        <h2>Reset your password</h2>

        {message && <p style={{color: "green", textAlign: "center", fontSize: "14px"}}>{message}</p>}
        {error && <p style={{color: "red", textAlign: "center", fontSize: "14px"}}>{error}</p>}

        <label>Email Address</label>
        <div className="input-with-button">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={otpSent || isSending} 
          />
          <button 
            className="send-otp-btn" 
            onClick={handleSendOtp}
            disabled={isSending || otpSent}
          >
            {isSending ? "..." : (otpSent ? "Sent" : "Send OTP")}
          </button>
        </div>

        {otpSent && (
          <>
            <label>OTP Code</label>
            <input
              type="text"
              placeholder="Enter OTP from server console"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button 
                className="verify-btn" 
                onClick={handleVerify}
            >
                Next Step
            </button>
          </>
        )}
      </div>
    </div>
  );
}