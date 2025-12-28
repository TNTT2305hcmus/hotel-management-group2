import { axiosClient } from "../api/axiosClient"; 

// URL cho các tính năng Setting (Lấy danh sách, xóa, chỉnh phụ phí...)
const SETTING_API_URL = '/api/settings'; 

// 1. Get Settings (GET)
export const fetchSettings = async () => {
    try {
        const res = await axiosClient.get(`${SETTING_API_URL}`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to fetch settings" };
    }
};

// 2. Update Surcharge (PUT)
export const updateSurchargeAPI = async (surchargeData) => {
    try {
        const res = await axiosClient.put(`${SETTING_API_URL}/surcharge`, surchargeData);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to update surcharge" };
    }
};

// 3. Reset Surcharge (POST)
export const resetSurchargeAPI = async () => {
    try {
        const res = await axiosClient.post(`${SETTING_API_URL}/surcharge/reset`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to reset surcharge" };
    }
};

// Get Accounts List
export const fetchAccountsAPI = async () => {
    try {
        const res = await axiosClient.get(`${SETTING_API_URL}/accounts`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to fetch accounts" };
    }
};

// Delete Account
export const deleteAccount = async (username) => {
    try {
        const res = await axiosClient.delete(`${SETTING_API_URL}/accounts/${username}`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to delete account" };
    }
};

// Create Account (Gọi API Register của Auth)
export const createAccountsAPI = async (userData) => {
    try {
        const payload = {
            username: userData.username,
            password: userData.password,
            email: userData.email,
            phone: userData.phone,        
            accountTypeID: userData.accountTypeID
        };
        // Giả sử bạn có route auth riêng
        const res = await axiosClient.post(`/api/auth/register`, payload); 
        return res.data;
    } catch (error) {
        throw error;
    }
};
