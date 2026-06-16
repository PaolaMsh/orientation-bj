import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ✅ Interceptor pour ajouter le token à chaque requête
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ✅ Interceptor pour gérer les erreurs de token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Si l'erreur est "Invalid or expired token" et qu'on n'a pas encore essayé de rafraîchir
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            error.response?.data?.message?.includes('expired') ||
            error.response?.data?.message?.includes('Invalid token')
        ) {
            originalRequest._retry = true;

            try {
                // Essayer de rafraîchir le token
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token');
                }

                const response = await axios.post(`${API_URL}/auth/refresh-token`, {
                    refreshToken,
                });

                const newToken = response.data.token;
                localStorage.setItem('token', newToken);

                // Mettre à jour le header et réessayer la requête originale
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Si le refresh échoue, déconnecter l'utilisateur
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                
                // Rediriger vers la page de connexion
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;