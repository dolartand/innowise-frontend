import api from './api.js';

export const getAllItems = async (params = {}) => {
    const resp = await api.get('/api/v1/items', { params });
    return resp.data;
}

export const getItemById = async (itemId) => {
    const resp = await api.get(`/api/v1/items/${itemId}`)
    return resp.data
}

export const searchItems = async (name) => {
    const response = await api.get('/api/v1/items/search', { params: { name } })
    return response.data
}

// Admin only
export const createItem = async (itemData) => {
    const resp = await api.post('/api/v1/items', itemData)
    return resp.data
}

export const updateItem = async (itemId, itemData) => {
    const resp = await api.put(`/api/v1/items/${itemId}`, itemData)
    return resp.data
}

export const deleteItem = async (itemId) => {
    await api.delete(`/api/v1/items/${itemId}`)
}