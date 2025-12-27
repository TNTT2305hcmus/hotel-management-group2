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

// 4. Get Receptionist List (GET)
export const fetchReceptionistsAPI = async () => {
    try {
        const res = await axiosClient.get(`${SETTING_API_URL}/receptionists`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to fetch receptionists" };
    }
};

// 5. Delete Receptionist (DELETE)
export const deleteReceptionistAPI = async (username) => {
    try {
        const res = await axios.delete(`${SETTING_API_URL}/receptionists/${username}`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to delete account" };
    }
};

// // 6. Create Receptionist 
export const createReceptionistAPI = async (userData) => {
    try {
        // Chuẩn bị dữ liệu để gửi cho controllersRegister
        const payload = {
            username: userData.username,
            password: userData.password,
            email: userData.email,
            phone: userData.phone,        
            // Gán cứng ID 2 để Controller biết đây là Lễ tân
            accountTypeID: 2 
        };

        // Gọi vào route /register -> Nó sẽ chạy vào controllersRegister
        const res = await axiosClient.post(`/api/auth/register`, payload);
        
        return res.data;
    } catch (error) {
        // Controller trả về lỗi 400 (err.message), ta hứng ở đây để hiện thông báo
        throw error;
    }
};
