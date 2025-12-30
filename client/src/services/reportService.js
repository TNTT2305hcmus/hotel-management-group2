import { axiosClient } from "../api/axiosClient";

const REPORT_URL = "/api/report";

// 1. Lấy dữ liệu tổng quan (Overview)
export const fetchReportOverview = async (month, year) => {
    try {
        const response = await axiosClient.get(`${REPORT_URL}/overview`, {
            params: { month, year }
        });
        return { success: true, data: response.data.data };
    } catch (error) {
        console.error("Error fetching overview:", error);
        return { success: false, data: null };
    }
};

// 2. Lấy báo cáo doanh thu theo loại phòng (Revenue)
export const fetchRevenueReport = async (month, year) => {
    try {
        const response = await axiosClient.get(`${REPORT_URL}/revenue`, {
            params: { month, year }
        });
        return { success: true, data: response.data.data || [] };
    } catch (error) {
        console.error("Error fetching revenue report:", error);
        return { success: false, data: [] };
    }
};

// 3. Lấy báo cáo mật độ sử dụng (Density/Bookings)
export const fetchDensityReport = async (month, year) => {
    try {
        const response = await axiosClient.get(`${REPORT_URL}/bookings`, {
            params: { month, year }
        });
        return { success: true, data: response.data.data || [] };
    } catch (error) {
        console.error("Error fetching density report:", error);
        return { success: false, data: [] };
    }
};