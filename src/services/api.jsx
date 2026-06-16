import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

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

// ✅ Variable pour éviter les boucles de refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// ✅ Interceptor pour gérer les erreurs de token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // ✅ Si c'est une erreur 401 et qu'on n'a pas encore essayé de rafraîchir
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Éviter les boucles sur les endpoints d'auth
            if (originalRequest.url.includes('/auth/refresh') || 
                originalRequest.url.includes('/auth/login') ||
                originalRequest.url.includes('/auth/logout')) {
                return Promise.reject(error);
            }

            const refreshToken = localStorage.getItem('refreshToken');

            // Si pas de refresh token, on déconnecte
            if (!refreshToken) {
                logoutUser();
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            // Si un refresh est déjà en cours, on attend
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch(err => Promise.reject(err));
            }

            isRefreshing = true;

            try {
                // ✅ Appel à /api/v1/auth/refresh
                const response = await axios.post(`${API_URL}/auth/refresh`, {
                    refreshToken: refreshToken
                });

                const newAccessToken = response.data.token || response.data.accessToken;
                const newRefreshToken = response.data.refreshToken;

                // Mettre à jour les tokens
                if (newAccessToken) {
                    localStorage.setItem('token', newAccessToken);
                }
                if (newRefreshToken) {
                    localStorage.setItem('refreshToken', newRefreshToken);
                }

                // ✅ Réessayer toutes les requêtes en attente
                processQueue(null, newAccessToken);

                // Réessayer la requête originale
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                console.error('Refresh token error:', refreshError);
                
                // Nettoyer les tokens
                logoutUser();
                
                // Rejeter toutes les requêtes en attente
                processQueue(refreshError, null);
                
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

// ✅ Fonction de déconnexion
const logoutUser = () => {
    // Optionnel: appeler /api/v1/auth/logout
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
        try {
            axios.post(`${API_URL}/auth/logout`, { refreshToken }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }).catch(() => {});
        } catch (e) {}
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Rediriger vers login après un court délai
    if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        setTimeout(() => {
            window.location.href = '/login';
        }, 500);
    }
};

export default api;