import axios from 'axios';

const FALLBACK_API_BASE_URL = 'https://api-orientation-production.up.railway.app/api/v1';
const API_BASE_URL = import.meta.env.VITE_API_URL || FALLBACK_API_BASE_URL;

if (!API_BASE_URL) {
    console.error("VITE_API_URL n'est pas définie dans .env");
}

if (!import.meta.env.VITE_API_URL) {
    console.warn(`VITE_API_URL absente, fallback vers ${FALLBACK_API_BASE_URL}`);
}

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            localStorage.clear();
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    },
);

export default api;
