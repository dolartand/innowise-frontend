import api from "./api.js";
import { saveToken, removeToken, getRefreshToken } from "../utils/auth.js";

export const login = async (email, password) => {
    const resp = await api.post('api/v1/auth/login', {email, password});
    const { accessToken, refreshToken, userId, email: userEmail, role } = resp.data;
    saveToken(accessToken, refreshToken);
    return { userId, email: userEmail, role };
}

export const register = async (userData) => {
    const resp = await api.post('api/v1/auth/register', userData);
    const { accessToken, refreshToken, userId, email, role } = resp.data;
    saveToken(accessToken, refreshToken);
    return { userId, email, role }
}

export const logout = async () => {
    try {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
            await api.post('api/v1/auth/logout', { refreshToken });
        }
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        removeToken();
    }
}

export const refreshAccessToken = async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
        throw new Error('No refresh token');
    }

    const resp = await api.post('api/v1/auth/refresh', { refreshToken });
    const { accessToken, refreshToken: newRefreshToken} = resp.data;
    saveToken(accessToken, newRefreshToken);
    return resp.data;
}