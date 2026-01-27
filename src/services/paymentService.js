import api from './api.js';;

export const getPaymentByOrderId = async (orderId) => {
    const resp = await api.get(`/api/v1/payments/order/${orderId}`);
    return resp.data;
}

export const getPaymentsByUserId = async (userId) => {
    const resp = await api.get(`/api/v1/payments/user/${userId}`);
    return resp.data;
}

export const getPaymentsByUserIdPaged = async (userId, params = {}) => {
    const resp = await api.get(`/api/v1/payments/user/${userId}/paged`, { params });
    return resp.data;
}

// Admin only
export const getPaymentsByStatus = async (status) => {
    const resp = await api.get(`/api/v1/payments/status/${status}`);
    return resp.data;
}

export const createPayment = async (paymentData) => {
    const resp = await api.post('/api/v1/payments', paymentData);
    return resp.data;
}

// Admin only
export const getPaymentsByStatusPaged = async (status, params = {}) => {
    const resp = await api.get(`/api/v1/payments/status/${status}/paged`, { params });
    return resp.data;
}

// Admin only
export const getUserPaymentSummary = async (userId, from, to) => {
    const resp = await api.get(`/api/v1/payments/user/${userId}/summary`, {
        params: { from, to }
    });
    return resp.data;
}

// Admin only
export const getGlobalPaymentSummary = async (from, to) => {
    const resp = await api.get('/api/v1/payments/summary', {
        params: { from, to }
    });
    return resp.data;
}

