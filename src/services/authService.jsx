// src/services/authService.js
import api from './api';

export const verifyEmail = async (token) => {
    console.log('🔑 verifyEmail appelé avec token:', token);
    
    if (!token || typeof token !== 'string') {
        throw new Error('Token invalide');
    }

    try {
        // ⚠️ IMPORTANT : Vérifie que l'URL est correcte
        console.log('📡 Appel API: /auth/verify-email?token=' + token);
        
        const response = await api.get('/auth/verify-email', {
            params: { token },
        });
        
        console.log('✅ Réponse reçue:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Erreur API:', error.response?.status, error.response?.data);
        
        // Message d'erreur plus clair
        if (error.response?.status === 404) {
            throw new Error('Le lien de vérification n\'existe pas ou a expiré.');
        }
        if (error.response?.status === 401) {
            throw new Error('Token invalide ou expiré. Demandez un nouveau lien.');
        }
        throw new Error(error.response?.data?.message || 'Erreur lors de la vérification');
    }
};