import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/ForgotPassword.css"; 
import { resetPasswordAPI } from "../services/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { email, otp } = location.state || {};

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State hiển thị pass
  
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State hiển thị confirm pass
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email || !otp) {
      navigate("/forgot-password");
    }
  }, [email, otp, navigate]);

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Ngăn sự kiện nổi bọt
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
    }

    setIsLoading(true);

    try {
        await resetPasswordAPI(email, otp, password);
        alert("Password reset successfully! Please login.");
        navigate("/login");
    } catch (err) {
        const msg = err.response?.data?.error || "Failed to reset password.";
        setError(msg);
        if (msg.includes("expired") || msg.includes("Invalid")) {
             setTimeout(() => navigate("/forgot-password"), 2000);
        }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h2>Set New Password</h2>
        <p style={{textAlign: "center", color: "#666"}}>Gmail: <strong>{email}</strong></p>

        {error && <p style={{color: "red", textAlign: "center"}}>{error}</p>}

        {/* --- INPUT MẬT KHẨU MỚI --- */}
        <label>New Password</label>
        <div className="password-wrapper">
            <input 
                // --- SỬA Ở ĐÂY: Thay đổi type dựa theo state ---
                type={showPassword ? "text" : "password"} 
                placeholder="Enter new password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="eye-icon-btn" // Class này cần được CSS (xem bên dưới)
              onClick={togglePasswordVisibility}
              tabIndex="-1"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
        </div>

        {/* --- INPUT XÁC NHẬN MẬT KHẨU --- */}
        <label>Confirm Password</label>
        <div className="password-wrapper">
            <input 
                // --- SỬA Ở ĐÂY ---
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="Confirm new password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="eye-icon-btn"
              onClick={toggleConfirmPasswordVisibility}
              tabIndex="-1"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
        </div>
        
        <button className="verify-btn" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;