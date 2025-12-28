import { axiosClient } from "../api/axiosClient"; 

// Get User Profile
export const fetchUserProfile = async (username) => {
    try {
        const res = await axiosClient.get(`/api/users/${username}`);
        return res.data;
    } catch (error) {
        throw error;
    }
};