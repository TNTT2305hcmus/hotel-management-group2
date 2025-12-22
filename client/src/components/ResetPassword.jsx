import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/ForgotPassword.css"; 
import { resetPasswordAPI } from "../services/authService";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Lấy email và otp được truyền từ trang ForgotPassword
  const { email, otp } = location.state || {};

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Nếu không có email/otp (truy cập trực tiếp link), đá về login
  useEffect(() => {
    if (!email || !otp) {
      navigate("/forgot-password");
    }
  }, [email, otp, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    
    if (!password || !confirmPassword) {
      setError("Please enter your new password!"); 
      return; 
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
        // Gọi API thật: gửi Email + OTP + Password
        await resetPasswordAPI(email, otp, password);
        
        alert("Password reset successfully! Please login.");
        navigate("/login");

    } catch (err) {
        const msg = err.response?.data?.error || "Failed to reset password. OTP might be invalid/expired.";
        setError(msg);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h2>New Password</h2>
        <p style={{textAlign: "center", color: "#666"}}>For account: {email}</p>

        {error && <p style={{color: "red", textAlign: "center"}}>{error}</p>}

        <label>New Password</label>
        <div className="password-wrapper">
            <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter new password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
            />
            <button type="button" className="toggle-password-btn" onClick={() => setShowPassword(!showPassword)}>
               {showPassword ? "👁️" : "🔒"}
            </button>
        </div>

        <label>Confirm Password</label>
        <div className="password-wrapper">
            <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Confirm new password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
            />
        </div>
        
        <button className="verify-btn" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Changing..." : "Change Password"}
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;