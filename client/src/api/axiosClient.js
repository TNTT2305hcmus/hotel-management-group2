import axios from "axios";

export const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8888",
});

export function attachAuthInterceptors({ getAccessToken, onAuthFail }) {
    const reqId = axiosClient.interceptors.request.use((config) => {
        const token = getAccessToken?.();
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    });

    const resId = axiosClient.interceptors.response.use(
        (res) => res,
        (error) => {
            if (error.response?.status === 401) {
                onAuthFail?.();
            }
            return Promise.reject(error);
        }
    );

    // ✅ trả về hàm detach để main.jsx gọi cleanup
    return () => {
        axiosClient.interceptors.request.eject(reqId);
        axiosClient.interceptors.response.eject(resId);
    };
}
