// src/services/bourseService.js
import api from './api';

export const bourseService = {
    // Récupérer toutes les bourses disponibles
    getAllScholarships: async () => {
        try {
            const response = await api.get('/scholarships');
            console.log('Bourses chargées:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur chargement bourses:', error);
            throw error;
        }
    },

    // Récupérer une bourse par son ID
    getScholarshipById: async (id) => {
        try {
            const response = await api.get(`/scholarships/${id}`);
            console.log('Bourse chargée:', response.data);
            return response.data;
        } catch (error) {
            console.error(`Erreur chargement bourse ${id}:`, error);
            throw error;
        }
    },

    // Rechercher des bourses
    searchScholarships: async (query) => {
        try {
            if (!query || query.trim() === '') {
                return [];
            }

            const url = `/scholarships/search?q=${encodeURIComponent(query.trim())}`;
            console.log('URL complète:', api.defaults.baseURL + url);

            const response = await api.get(url);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la recherche pour "${query}":`, error);
            console.error("Détails de l'erreur:", error.response?.data);
            throw error;
        }
    },

    // Récupérer les bourses recommandées pour un utilisateur (basé sur son profil RIASEC)
    getRecommendedScholarships: async (assessmentId) => {
        try {
            const response = await api.get(`/users/me/assessments/${assessmentId}/recommendations`, {
                params: { limit: 10 }
            });
            console.log('Bourses recommandées:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur chargement bourses recommandées:', error);
            return { scholarships: [] };
        }
    },

    // ✅ CORRIGÉ: Sauvegarder une bourse (POST avec paramètre PATH)
    saveScholarship: async (scholarshipId) => {
        try {
            // L'API utilise le paramètre PATH, pas QUERY
            const response = await api.post(`/users/me/scholarship/${scholarshipId}`);
            console.log('✅ Bourse sauvegardée:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur sauvegarde bourse:', error);
            throw error;
        }
    },

    // ✅ CORRIGÉ: Supprimer une bourse des favoris (DELETE avec paramètre path)
    removeSavedScholarship: async (scholarshipId) => {
        try {
            const response = await api.delete(`/users/me/scholarship/${scholarshipId}`);
            console.log('✅ Bourse supprimée des favoris:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur suppression bourse:', error);
            throw error;
        }
    },

    // ✅ CORRIGÉ: Récupérer une bourse spécifique (GET avec paramètre QUERY)
    getSpecificSavedScholarship: async (scholarshipId) => {
        try {
            const response = await api.get('/users/me/scholarship', {
                params: { scholarshipId }
            });
            console.log('✅ Bourse spécifique récupérée:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur récupération bourse spécifique:', error);
            throw error;
        }
    },

    // ⚠️ NOTE: Cet endpoint N'EXISTE PAS dans votre API
    // Vous devez gérer cela différemment
    getSavedScholarships: async () => {
        try {
            // Solution 1: Récupérer depuis localStorage
            const localSaved = localStorage.getItem('savedScholarships');
            if (localSaved) {
                try {
                    return JSON.parse(localSaved);
                } catch (e) {
                    return [];
                }
            }
            
            // Solution 2: Si vous avez un endpoint pour lister toutes les bourses sauvegardées
            // Mais d'après votre documentation, il n'existe pas
            // const response = await api.get('/users/me/scholarships');
            // return response.data;
            
            return [];
        } catch (error) {
            console.error('❌ Erreur chargement bourses sauvegardées:', error);
            return [];
        }
    }
};