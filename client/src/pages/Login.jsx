import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/Login.css";
import hotelImg from "../assets/hotel.jpg";
import { useAuth } from "../api/AuthContext";

// 1. Import Icon từ React-Icons
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Hàm xử lý toggle password riêng để tránh xung đột sự kiện
  const togglePasswordVisibility = (e) => {
    // Ngăn chặn hành vi click lan ra form gây submit nhầm
    e.preventDefault();
    e.stopPropagation();
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    // 2. Ngăn chặn reload trang ngay lập tức
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
      return;
    }

    setIsLoading(true);

    try {
      await login({ username, password });
      navigate("/dashboard");
    } catch (err) {
      console.error("Login Error:", err);

      let errorMessage = "";

      if (!err.response) {
        errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.";
      } else if (err.response.status === 401) {
        errorMessage = "Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại.";
      } else if (err.response.status === 400) {
        errorMessage = err.response.data?.error || "Thông tin đăng nhập không hợp lệ.";
      } else if (err.response.status === 500) {
        errorMessage = "Lỗi máy chủ. Vui lòng thử lại sau.";
      } else {
        errorMessage = err.response.data?.error || "Đã xảy ra lỗi. Vui lòng thử lại.";
      }

      setError(errorMessage);
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
          <h1>Welcome Back!</h1>

          {error && <p className="error-text">{error}</p>}

          {/* 3. Form onSubmit: 
             Đây là cách chuẩn để lắng nghe phím Enter. 
             Khi focus ở input và nhấn Enter, nó sẽ tự tìm nút submit để kích hoạt.
          */}
          <form onSubmit={handleLogin}>
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus // Tự động focus vào đây khi vào trang
            />

            <label>Password</label>
            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* 4. Xử lý Icon Show Password:
                */}
              <button
                type="button"
                className="eye-icon-btn"
                onClick={togglePasswordVisibility}
                tabIndex="-1"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="row-options">
              <div></div>
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}