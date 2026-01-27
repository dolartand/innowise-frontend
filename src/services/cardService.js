import api from './api.js';

export const getUserCards = async (userId) => {
    const resp = await api.get(`/api/v1/users/${userId}/cards`);
    return resp.data;
}

export const addCard = async (userId, cardData) => {
    const resp = await api.post(`/api/v1/users/${userId}/cards`, cardData);
    return resp.data;
}

export const updateCard = async (cardId, cardData) => {
    const resp = await api.put(`/api/v1/cards/${cardId}`, cardData);
    return resp.data;
}

export const deleteCard = async (cardId) => {
    await api.delete(`/api/v1/cards/${cardId}`);
}