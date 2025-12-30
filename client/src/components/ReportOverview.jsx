import React from 'react';
import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

const ReportOverview = ({ data }) => {
    // 1. Lấy thêm rentalDaysGrowth từ data
    const { 
        totalRevenue = 0, 
        revenueGrowth = 0, 
        totalRentalDays = 0,
        rentalDaysGrowth = 0 // <--- QUAN TRỌNG: Lấy dữ liệu này
    } = data || {};

    // Helper: Hàm render mũi tên và màu sắc
    const renderGrowth = (value) => {
        const numVal = parseFloat(value);
        let colorClass = 'growth-neutral';
        let Icon = FaMinus;

        if (numVal > 0) {
            colorClass = 'growth-up';
            Icon = FaArrowUp;
        } else if (numVal < 0) {
            colorClass = 'growth-down';
            Icon = FaArrowDown;
        }

        return (
            <span className={`stat-growth ${colorClass}`}>
                <Icon /> {Math.abs(numVal)}% vs last month
            </span>
        );
    };

    return (
        <div className="overview-section">
            {/* Card 1: Total Revenue */}
            <div className="stat-card">
                <span className="stat-label">Total Revenue</span>
                <span className="stat-value">
                    {Number(totalRevenue).toLocaleString()} VND
                </span>
                {/* Hiển thị tăng trưởng doanh thu */}
                {renderGrowth(revenueGrowth)}
            </div>

            {/* Card 2: Total Booking Days */}
            <div className="stat-card">
                <span className="stat-label">Total Booking Days</span>
                <span className="stat-value">
                    {Number(totalRentalDays).toLocaleString()} days
                </span>
                {/* Hiển thị tăng trưởng mật độ */}
                {renderGrowth(rentalDaysGrowth)} 
            </div>
        </div>
    );
};

export default ReportOverview;