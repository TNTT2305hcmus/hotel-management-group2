import React from 'react';

const DensityTable = ({ data }) => {
    return (
        <div className="report-section">
            <h3 className="section-header">Room Occupancy Density</h3>
            <div className="table-responsive">
                <table className="report-table">
                    <thead>
                        <tr>
                            <th className="text-center" style={{width: '10%'}}>STT</th>
                            <th style={{width: '40%'}}>Room Number</th>
                            <th className="text-center" style={{width: '30%'}}>Total Rental Days</th>
                            <th className="text-right" style={{width: '20%'}}>Proportion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={index}>
                                    <td className="text-center">{index + 1}</td>
                                    <td className="font-bold">Room {item.roomNumber}</td>
                                    <td className="text-center">{item.totalRentalDays}</td>
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

export default DensityTable;