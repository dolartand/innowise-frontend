import api from './api.js';

export const createOrder = async (orderData) => {
    const resp = await api.post('/api/v1/orders', orderData);
    return resp.data;
}

export const getOrderById = async (orderId) => {
    const resp = await api.get(`/api/v1/orders/${orderId}`);
    return resp.data;
}

export const getOrdersByUserId = async (userId, params = {}) => {
    const resp = await api.get(`/api/v1/orders/user/${userId}`, { params });
    return resp.data;
}

// Admin only
export const getAllOrders = async (params = {}) => {
    const resp = await api.get('/api/v1/orders', { params });
    return resp.data;
}

export const updateOrder = async (orderId, orderData) => {
    const resp = await api.put(`/api/v1/orders/${orderId}`, orderData);
    return resp.data;
}

export const updateOrderStatus = async (orderId, status) => {
    const resp = await api.patch(`/api/v1/orders/${orderId}/status`, null, {
        params: { status }
    });
    return resp.data;
}

export const deleteOrder = async (orderId) => {
    await api.delete(`/api/v1/orders/${orderId}`);
}