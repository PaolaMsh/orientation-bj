import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { AuthContext } from './auth';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return null;

        try {
            return JSON.parse(storedUser);
        } catch {
            localStorage.removeItem('user');
            return null;
        }
    });
    const [token, setToken] = useState(localStorage.getItem('token'));
    const isAuthenticated = !!token;

    useEffect(() => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete api.defaults.headers.common['Authorization'];
        }
    }, [token]);

    const login = (userData, authToken, refreshToken) => {
        console.log('🔐 Login appelé avec:', { userData, authToken });

        setUser(userData);
        setToken(authToken);
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        }
        api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

        console.log('✅ État après login - isAuthenticated:', true);
        console.log('✅ Token stocké:', authToken);
    };

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            await api.post('/auth/logout', { refreshToken });
        } catch (error) {
            console.error('Erreur logout:', error);
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            delete api.defaults.headers.common['Authorization'];
            console.log('✅ Utilisateur déconnecté');
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
