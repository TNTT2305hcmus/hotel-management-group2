import React, { useState, useEffect } from 'react';
import '../css/Report.css';

// Services
import { 
    fetchReportOverview, 
    fetchRevenueReport, 
    fetchDensityReport 
} from '../services/reportService';

// Components
import ReportFilter from '../components/ReportFilter';
import ReportOverview from '../components/ReportOverview';
import RevenueTable from '../components/RevenueTable';
import DensityTable from '../components/DensityTable';

const Report = () => {
    // Default: Tháng hiện tại
    const today = new Date();
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [year, setYear] = useState(today.getFullYear());

    // Data States
    const [overviewData, setOverviewData] = useState(null);
    const [revenueData, setRevenueData] = useState([]);
    const [densityData, setDensityData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadReportData = async () => {
            setLoading(true);
            try {
                // Gọi song song 3 API để tối ưu tốc độ
                const [overviewRes, revenueRes, densityRes] = await Promise.all([
                    fetchReportOverview(month, year),
                    fetchRevenueReport(month, year),
                    fetchDensityReport(month, year)
                ]);

                if (overviewRes.success) setOverviewData(overviewRes.data);
                if (revenueRes.success) setRevenueData(revenueRes.data);
                if (densityRes.success) setDensityData(densityRes.data);

            } catch (error) {
                console.error("Failed to load report data", error);
            } finally {
                setLoading(false);
            }
        };

        loadReportData();
    }, [month, year]);

    return (
        <div className="report-page">
            <h1 className="report-title">Monthly Report</h1>

            {/* 1. Filter Bar */}
            <ReportFilter 
                month={month} 
                year={year} 
                onMonthChange={setMonth} 
                onYearChange={setYear} 
            />

            {loading ? (
                <div style={{textAlign: 'center', marginTop: '50px', fontSize: '1.2rem', color: '#666'}}>
                    Loading report data...
                </div>
            ) : (
                <>
                    {/* 2. Overview Cards */}
                    <ReportOverview data={overviewData} />

                    {/* 3. Revenue Table */}
                    <RevenueTable data={revenueData} />

                    {/* 4. Density Table */}
                    <DensityTable data={densityData} />
                </>
            )}
        </div>
    );
};

export default Report;