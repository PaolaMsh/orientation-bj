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
            // Ne pas throw, retourner un tableau vide
            return { scholarships: [] };
        }
    },

    // Sauvegarder une bourse dans les favoris (POST avec paramètre query)
    saveScholarship: async (scholarshipId) => {
        try {
            // Utilisation du paramètre query comme indiqué dans la documentation
            const response = await api.post('/users/me/scholarship', null, {
                params: { scholarshipId }
            });
            console.log('Bourse sauvegardée:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur sauvegarde bourse:', error);
            throw error;
        }
    },

    // Supprimer une bourse des favoris (DELETE avec paramètre path)
    removeSavedScholarship: async (scholarshipId) => {
        try {
            // Utilisation du paramètre path comme indiqué dans la documentation
            const response = await api.delete(`/users/me/scholarship/${scholarshipId}`);
            console.log('Bourse supprimée des favoris:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur suppression bourse:', error);
            throw error;
        }
    },

    // Récupérer une bourse spécifique sauvegardée par l'utilisateur (GET avec paramètre query)
    getSpecificSavedScholarship: async (scholarshipId) => {
        try {
            const response = await api.get('/users/me/scholarship', {
                params: { scholarshipId }
            });
            console.log('Bourse spécifique récupérée:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur récupération bourse spécifique:', error);
            throw error;
        }
    },

    // Récupérer toutes les bourses sauvegardées par l'utilisateur
    getSavedScholarships: async () => {
        try {
            // Note: Cet endpoint pourrait ne pas exister dans votre API
            // Vous pourriez avoir besoin d'un endpoint différent ou de filtrer toutes les bourses
            const response = await api.get('/users/me/scholarships');
            console.log('Bourses sauvegardées:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur chargement bourses sauvegardées:', error);
            // Fallback: essayer de récupérer depuis localStorage
            const localSaved = localStorage.getItem('savedScholarships');
            if (localSaved) {
                try {
                    return JSON.parse(localSaved);
                } catch (e) {
                    return [];
                }
            }
            return [];
        }
    }
};