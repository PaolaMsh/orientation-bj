import api from './api';

const authService = {
    // ✅ Connexion
    async login(email, password) {
        try {
            const response = await api.post('/auth/login', { email, password });
            const data = response.data;
            
            // Stocker les tokens
            if (data.token || data.accessToken) {
                localStorage.setItem('token', data.token || data.accessToken);
            }
            if (data.refreshToken) {
                localStorage.setItem('refreshToken', data.refreshToken);
            }
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    // ✅ Inscription
    async register(userData) {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    },

    // ✅ Déconnexion
    async logout() {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                await api.post('/auth/logout', { refreshToken });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
    },

    // ✅ Rafraîchir le token manuellement
    async refreshToken() {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                throw new Error('No refresh token');
            }

            const response = await api.post('/auth/refresh', { refreshToken });
            const data = response.data;

            if (data.token || data.accessToken) {
                localStorage.setItem('token', data.token || data.accessToken);
            }
            if (data.refreshToken) {
                localStorage.setItem('refreshToken', data.refreshToken);
            }

            return data;
        } catch (error) {
            console.error('Refresh token error:', error);
            throw error;
        }
    },

    // ✅ Vérifier si l'utilisateur est authentifié
    isAuthenticated() {
        const token = localStorage.getItem('token');
        return !!token;
    },

    // ✅ Récupérer l'utilisateur courant
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (e) {
                return null;
            }
        }
        return null;
    }
};

export default authService;