import { axiosClient } from "../api/axiosClient"; 

// user profile data
export const fetchUserProfile = (username) => {
    return axiosClient.get(`/api/accounts/${username}`);
};

// account list (manager)
export const fetchAccounts = () => {
    return axiosClient.get("/api/accounts");
};

// add account
export const createAccount = (accountData) => {
    return axiosClient.post("/api/accounts", accountData);
};

// delete account
export const deleteAccount = (username) => {
    return axiosClient.delete(`/api/accounts/${username}`);
};