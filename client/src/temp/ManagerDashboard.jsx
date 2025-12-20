//================== XÓA ===================
// Đồ dỏm có mỗi nút đăng xuất để test thôi
import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardManager = () => {
  const navigate = useNavigate();
  
  // Lấy thông tin user từ localStorage để hiển thị
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleLogout = () => {
    // Xóa token và thông tin user
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    // Quay về trang login
    navigate("/login");
  };

  return (
    <div style={{ padding: "40px", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <br />
      <button 
        onClick={handleLogout}
        style={{ marginTop: "30px", padding: "10px 20px", background: "#3d26eeff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
      >
        Đăng xuất Quản lý
      </button>
    </div>
  );
};

export default DashboardManager;