import { useState, useEffect } from "react";
import NavigationBar from "../components/NavigationBar";
import { useAuth } from "../api/AuthContext";
import "../css/Header.css";
import { FaHotel, FaUserCircle } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom"; 

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeKey, setActiveKey] = useState("home");
    
    // Lấy thông tin user từ Auth Context thay vì props
    const { user } = useAuth(); 

    // Fallback nếu chưa đăng nhập hoặc chưa load xong user
    const userName = user?.username || "Guest";
    const userRole = user?.accountTypeName || "Visitor";

    useEffect(() => {
        const path = location.pathname;
        if (path === "/" || path === "/dashboard") setActiveKey("home");
        else if (path.startsWith("/check-in")) setActiveKey("checkin");
        else if (path.startsWith("/check-out")) setActiveKey("checkout");
        else if (path.startsWith("/report")) setActiveKey("report");
        else if (path.startsWith("/settings")) setActiveKey("settings");
    }, [location]);

    const handleNavigate = (key) => {
        setActiveKey(key); 
        
        // Điều hướng sang trang tương ứng
        switch (key) {
            case "home":
                navigate("/dashboard"); 
                break;
            case "checkin":
                navigate("/check-in");
                break;
            case "checkout":
                navigate("/check-out");
                break;
            case "report":
                navigate("/report");
                break;
            case "settings":
                navigate("/settings");
                break;
            default:
                navigate("/dashboard");
        }
    };

    // Hàm xử lý khi click vào Avatar
    const handleProfileClick = () => {
        navigate("/profile");
    };

    return (
        <header className="hm-header">
            {/* 1. Left: Logo */}
            <div className="hm-header__brand" onClick={() => navigate("/")} style={{cursor: "pointer"}}>
                <div className="hm-logo-icon">
                    <FaHotel />
                </div>
                <span className="hm-logo-text">HOTEL</span>
            </div>

            {/* 2. Center: Navigation */}
            <div className="hm-header__nav">
                {/* --- SỬA LỖI TẠI ĐÂY --- */}
                {/* Truyền handleNavigate thay vì setActiveKey */}
                <NavigationBar activeKey={activeKey} onNavigate={handleNavigate} />
            </div>

            {/* 3. Right: Actions & Profile */}
            <div className="hm-header__actions">
                {/* User Profile Container */}
                {/* Nên đặt onClick ở container ngoài cùng để vùng click rộng hơn */}
                <div className="hm-user-container" onClick={handleProfileClick}>
                    <div className="hm-user-info-trigger">
                         <FaUserCircle className="hm-user-avatar" />
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