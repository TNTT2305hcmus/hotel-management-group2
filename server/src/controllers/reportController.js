import ReportService from '../services/reportService.js';

// Helper để lấy tháng năm hiện tại nếu client không gửi
const getMonthYear = (req) => {
    const today = new Date();
    const month = req.query.month || (today.getMonth() + 1);
    const year = req.query.year || today.getFullYear();
    return { month, year };
};

export const getOverviewReport = async (req, res) => {
    try {
        const { month, year } = getMonthYear(req);
        const data = await ReportService.getOverview(month, year);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching overview report" });
    }
};

export const getRevenueReport = async (req, res) => {
    try {
        const { month, year } = getMonthYear(req);
        const data = await ReportService.getRevenueReport(month, year);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching revenue report" });
    }
};

export const getDensityReport = async (req, res) => {
    try {
        const { month, year } = getMonthYear(req);
        const data = await ReportService.getDensityReport(month, year);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching density report" });
    }
};