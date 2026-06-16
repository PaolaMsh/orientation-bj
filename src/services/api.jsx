// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'https://api-orientation-production.up.railway.app/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// ⚠️ AJOUTE CET INTERCEPTEUR POUR VOIR LES REQUÊTES
api.interceptors.request.use(
    (config) => {
        console.log('🚀 Requête sortante:', config.method.toUpperCase(), config.url);
        console.log('📦 Paramètres:', config.params);
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => {
        console.log('✅ Réponse reçue:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('❌ Erreur réponse:', error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

export default api;