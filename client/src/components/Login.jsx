import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import "../styles/login.css";
import hotelImg from "../assets/hotel.jpg";
import axios from "axios"; // Nếu chưa cài axios: npm install axios

//==============================XÓA KHI CÓ BACKEND=================================
// API giả lập
import { loginApi } from "../temp/mockApi";
//==============================XÓA KHI CÓ BACKEND=================================

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("receptionist"); // Mặc định chọn 1 role
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Hàm xử lý Logic Đăng Nhập
  const handleLogin = async () => {
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setIsLoading(true);

    try {
      // - Gọi API từ backend để đăng nhập
      // const res = await axios.post("MY_API_URL/login", { username, password, role });

//==================================XÓA=========================================   
      // Giả lập API trả về thành công (Thay bằng API từ backend)
      const res = await loginApi(username, password, role); 
//==================================XÓA=========================================

      if (res.status === 200) {
        const { token, user, requireOtp } = res.data;

        // Lưu Token & User vào LocalStorage
        localStorage.setItem("accessToken", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Chuyển hướng Dashboard
        if (!requireOtp) {
          const userRole = user.role; 
          if (userRole === "manager") {
             // Nếu là Quản lý -> Sang trang Dashboard Quản lý
             navigate("/manager-dashboard"); 
          } else if (userRole === "receptionist") {
             // Nếu là Lễ tân -> Sang trang Dashboard Lễ tân
             navigate("/receptionist-dashboard"); 
          } else {
             navigate("/"); 
          }
        }
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Hình ảnh bên trái */}
      <div className="login-image-section">
        <img src={hotelImg} alt="Hotel Windsor" />
      </div>

      {/* Form đăng nhập bên phải */}
      <div className="login-form-section">
        <div className="login-card">
          <h1>Welcome</h1>
          
          {error && <p style={{ color: "red", fontSize: "14px", marginBottom: "10px", textAlign: "center" }}>{error}</p>}

          <label>User name</label>
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
            {/* Dùng vector để vẽ icon ẩn/hiện mật khẩu */}
            {showPassword ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line> </svg> : 
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
            </svg>}
          </span>
          </div>

          <div className="row-options">
            <select 
                className="role-select"
                value={role} 
                onChange={(e) => setRole(e.target.value)}
            >
              {/* <option value="">Selecting a role</option> */}
              <option value="receptionist">Receptionist</option>
              <option value="manager">Manager</option>
            </select>

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
