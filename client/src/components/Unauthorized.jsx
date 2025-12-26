import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Unauthorized.css';

const Unauthorized = ({ onClose }) => {
    const navigate = useNavigate();

    return (
        <div className="unauthorized-overlay">
            <div className="unauthorized-content">
                <h1>Access Denied</h1>
                <p>Bạn không có quyền thực hiện chức năng này (Chỉ dành cho Manager).</p>
                
                {/* Nếu dùng như Modal thì nút này đóng modal */}
                {onClose ? (
                     <button onClick={onClose} className="btn-back">Close</button>
                ) : (
                    // Nếu dùng như trang riêng thì nút này về Home
                    <button onClick={() => navigate('/')} className="btn-back">Go Home</button>
                )}
            </div>
        </div>
    );
};

export default Unauthorized;