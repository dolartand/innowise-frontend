import axios from 'axios'
import { getToken, removeToken, getRefreshToken, saveToken } from "../utils/auth.js";
import { API_URL } from "../utils/constants.js";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalReq = error.config;
        if (error.response?.status === 401 && !originalReq._retry) {
            originalReq._retry = true;

            const refreshToken = getRefreshToken();
            if (refreshToken) {
                try {
                    const response = await axios.post(`${API_URL}/api/v1/auth/refresh`, {
                        refreshToken
                    });
                    const { accessToken, refreshToken: newRefreshToken } = response.data;
                    saveToken(accessToken, newRefreshToken);

                    originalReq.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalReq);
                } catch (refreshError) {
                    removeToken();
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            } else {
                removeToken();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;