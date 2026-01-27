import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = 'accessTokem';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const saveToken = (accessToken, refreshToken = null) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
}

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
}

export const getRefreshToken = () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export const decodeToken = () => {
    const token = getToken();
    if (!token) {
        return null;
    }

    try {
        const decoded = jwtDecode(token);
        return {
            userId: decoded.userId || decoded.sub,
            email: decoded.email,
            role: decoded.role
        }
    } catch (error) {
        console.error('Error decoding token: ', error);
        return null;
    }
}

export const isTokenExpired = () => {
    const token = getToken();
    if (!token) {
        return true;
    }

    try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        return decoded.exp < now;
    } catch (error) {
        return true;
    }
}

export const isAuthenticated = () => {
    return getToken() && !isTokenExpired();
}

export const isAdmin = () => {
    const decoded = decodeToken();
    return decoded?.role === 'ADMIN';
}