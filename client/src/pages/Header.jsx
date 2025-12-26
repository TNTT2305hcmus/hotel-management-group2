import { useState } from "react";
import NavigationBar from "../components/NavigationBar";
import { useAuth } from "../api/AuthContext"; // Import hook useAuth
import "../css/Header.css";
import { FaHotel, FaUserCircle } from "react-icons/fa";

export default function Header() {
    const [activeKey, setActiveKey] = useState("home");
    
    // Lấy thông tin user từ Auth Context thay vì props
    const { user } = useAuth(); 

    // Fallback nếu chưa đăng nhập hoặc chưa load xong user
    const userName = user?.username || "Guest";
    const userRole = user?.accountTypeName || "Visitor";

    return (
        <header className="hm-header">
            {/* 1. Left: Logo */}
            <div className="hm-header__brand">
                <div className="hm-logo-icon">
                    <FaHotel />
                </div>
                <span className="hm-logo-text">HOTEL</span>
            </div>

            {/* 2. Center: Navigation */}
            <div className="hm-header__nav">
                <NavigationBar activeKey={activeKey} onNavigate={setActiveKey} />
            </div>

            {/* 3. Right: Actions & Profile */}
            <div className="hm-header__actions">
                {/* User Profile Container */}
                <div className="hm-user-container">
                    {/* Hiển thị Avatar và Tên User */}
                    <div className="hm-user-info-trigger">
                         <FaUserCircle className="hm-user-avatar" />
                         {/* Nếu muốn hiện tên ngay cạnh avatar thì bỏ comment dòng dưới */}
                         {/* <span className="hm-user-name-text">{userName}</span> */}
                    </div>
                    
                    {/* Badge Role (Tooltip) */}
                    <div className="hm-role-tooltip">
                        <div className="tooltip-content">
                            <span className="user-display-name">{userName}</span>
                            <span className="role-badge">{userRole}</span>
                        </div>
                        <div className="tooltip-arrow"></div>
                    </div>
                </div>
            </div>
        </header>
    );
}