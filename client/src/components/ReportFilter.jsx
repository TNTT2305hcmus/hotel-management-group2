import React from 'react';

const ReportFilter = ({ month, year, onMonthChange, onYearChange }) => {
    // Tạo mảng năm từ 2023 đến hiện tại + 1
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

    return (
        <div className="report-filter-bar">
            <div className="filter-group">
                <label>Month:</label>
                <select 
                    className="filter-select" 
                    value={month} 
                    onChange={(e) => onMonthChange(Number(e.target.value))}
                >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label>Year:</label>
                <select 
                    className="filter-select" 
                    value={year} 
                    onChange={(e) => onYearChange(Number(e.target.value))}
                >
                    {years.map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default ReportFilter;