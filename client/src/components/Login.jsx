import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import "../css/Login.css";
import hotelImg from "../assets/hotel.jpg";
import { useAuth } from "../api/AuthContext"; 

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Gọi hàm login từ AuthContext (nó sẽ gọi API backend)
      const data = await login({ username, password });
      
      // Đẩy về 1 dashboard duy nhất
      navigate("/dashboard"); // Mặc định

    } catch (err) {
      console.error(err);
      // Lấy message lỗi từ backend nếu có
      const msg = err.response?.data?.error || "Login failed. Incorrect username or password.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-image-section">
        <img src={hotelImg} alt="Hotel Windsor" />
      </div>

      <div className="login-form-section">
        <div className="login-card">
          <h1>Welcome Back</h1>
          
          {error && <p style={{ color: "red", fontSize: "14px", marginBottom: "10px", textAlign: "center" }}>{error}</p>}

          <label>Username</label>
          <input 
            type="text" 
            placeholder="Enter your username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Password</label>
          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span 
              className="eye-icon" 
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer" }}
            >
              {showPassword ? "👁️" : "🔒"} 
            </span>
          </div>

          <div className="row-options">
             {/* Bỏ chọn Role ở đây vì Backend sẽ quyết định Role */}
            <div></div> 
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>

          <button 
            className="login-btn" 
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}