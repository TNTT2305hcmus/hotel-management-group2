import { Navigate } from "react-router-dom";

// Nhận thêm prop "allowedRoles"
const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user")); // Lấy thông tin user để check role

  // Chưa đăng nhập -> Về Login
  if (!token) {
    return <Navigate to="/login" />;
  }
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    if (user?.role === "manager") return <Navigate to="/manager-dashboard" />;
    if (user?.role === "receptionist") return <Navigate to="/receptionist-dashboard" />;
    return <Navigate to="/" />;
  }
  return children;
};

export default PrivateRoute;