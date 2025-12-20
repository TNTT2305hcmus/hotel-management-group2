import { useState } from "react";
import "../css/Header.css";
import NavigationBar from "./NavigationBar";
import { FaHotel, FaBell, FaUserCircle } from "react-icons/fa";


export default function Header({
    userName = "Minh Thang",
    userRole = "Manager",
}) {
    const [activeKey, setActiveKey] = useState("rooms");

    return (
        <header className="hm-header">
            <div className="hm-header__left">
                <div className="hm-brand">
                    <div className="hm-brand__logo" aria-hidden="true">
                        <FaHotel />
                    </div>
                    <div className="hm-brand__text">
                        <div className="hm-brand__title">HOTEL</div>
                        <div className="hm-brand__title">MANAGER</div>
                    </div>
                </div>

                <NavigationBar activeKey={activeKey} onNavigate={setActiveKey} />
            </div>

            <div className="hm-header__right">
                <div className="hm-userpill">
                    <FaUserCircle className="hm-userpill__avatar" aria-hidden="true" />
                    <div className="hm-userpill__info">
                        <div className="hm-userpill__name">{userName}</div>
                        <div className="hm-userpill__role">{userRole}</div>
                    </div>
                </div>

                <button className="hm-bell" type="button" title="Notifications">
                    <FaBell />
                </button>
            </div>
        </header>
    );
}
