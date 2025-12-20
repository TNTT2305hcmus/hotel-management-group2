import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Forgot.css"; 
import { resetPasswordApi } from "../temp/mockApi";
// import { validatePassword } from "../temp/validation";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
// Kiểm tra xem có Token reset không (Bảo vệ trang)
  useEffect(() => {
    const token = localStorage.getItem("resetToken");
    if (!token) {
      alert("You have not verified the OTP! Please go back.");
      navigate("/forgot-password"); // chuyển về trang đầu
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    
    if (!password || !confirmPassword) {
      setMessage("Please enter your new password!"); 
      return; 
    }
    // Kiểm tra mật khẩu và xác nhận mật khẩu có giống nhau không
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    // // Kiểm tra độ mạnh mật khẩu
    // const weakPasswordError = validatePassword(password);
    // if (weakPasswordError) {
    //   setMessage(weakPasswordError);
    //   return;
    // }

    //==================================XÓA KHI CÓ BACKEND=========================================
    // Gọi API đổi mật khẩu
    // await resetPasswordApi(newPassword);
    // Thay API từ back end khi cài đặt
    //==================================XÓA KHI CÓ BACKEND=========================================
    

    setIsLoading(true);

    try {
        const token = localStorage.getItem("resetToken");
        const res = await resetPasswordApi(token, password);
        
        if (res.success) {
            alert("Password reset successfully!");
            localStorage.removeItem("resetToken");
            navigate("/login");
        }
    } catch (err) {
        setMessage(err.message || "Failed to reset password.");
    } finally {
        setIsLoading(false);
    }
  };
  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h2>New Password</h2>
        <p style={{textAlign: "center", marginBottom: "20px", color: "#666"}}>
           Enter your new password below.
        </p>

        {message && <p style={{color: "red", textAlign: "center"}}>{message}</p>}

        <label>New Password</label>
        <div className="password-wrapper">
            <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter new password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
            />
            {/* Nút con mắt */}
            <button 
                type="button"
                className="toggle-password-btn" 
                onClick={() => setShowPassword(!showPassword)}
            >
                {/* Icon Mắt đóng/mở */}
                {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
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
            <button 
                type="button"
                className="toggle-password-btn" 
                onClick={() => setShowPassword(!showPassword)}
            >
                {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
            </button>
        </div>
        <button className="verify-btn" onClick={handleSubmit} disabled={isLoading}>
          Change
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;