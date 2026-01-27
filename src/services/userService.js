import api from './api.js';

export const getUserById = async (userId) => {
    const resp = await api.get(`/api/v1/users/${userId}`);
    return resp.data;
}

export const getAllUsers = async (params = {}) => {
    const resp = await api.get('/api/v1/users', { params });
    return resp.data;
}

export const updateUser = async (userId, userData) => {
    const resp = await api.put(`/api/v1/users/${userId}`, userData);
    return resp.data;
}

export const deleteUser = async (userId) => {
    await api.delete(`/api/v1/users/${userId}`);
}

export const changeUserActivity = async (userId, isActive) => {
    await api.patch(`/api/v1/users/${userId}/activity`, null, {
        params: { isActive }
    });
}