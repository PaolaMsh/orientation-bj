import axios from 'axios';
const API_BASE_URL = 'https://api-orientation-production.up.railway.app/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: false, // Important pour CORS
});

export default api;
