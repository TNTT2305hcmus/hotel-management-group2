import React from 'react';

const RevenueTable = ({ data }) => {
    return (
        <div className="report-section">
            <h3 className="section-header">Revenue by Room Type</h3>
            <div className="table-responsive">
                <table className="report-table">
                    <thead>
                        <tr>
                            <th className="text-center" style={{width: '10%'}}>STT</th>
                            <th style={{width: '40%'}}>Room Type</th>
                            <th className="text-right" style={{width: '30%'}}>Revenue (VND)</th>
                            <th className="text-right" style={{width: '20%'}}>Proportion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={index}>
                                    <td className="text-center">{index + 1}</td>
                                    <td className="font-bold">{item.roomType}</td>
                                    <td className="text-right">{item.revenue.toLocaleString()}</td>
                                    <td className="text-right">{item.proportion}%</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className="text-center">No data available</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RevenueTable;