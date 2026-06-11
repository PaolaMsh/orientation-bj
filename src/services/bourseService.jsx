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

    // Sauvegarder une bourse dans les favoris
    saveScholarship: async (scholarshipData) => {
        try {
            const response = await api.post('/users/me/saved-scholarships', scholarshipData);
            console.log('Bourse sauvegardée:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur sauvegarde bourse:', error);
            throw error;
        }
    },

    // Supprimer une bourse des favoris
    removeSavedScholarship: async (scholarshipId) => {
        try {
            const response = await api.delete(`/users/me/saved-scholarships/${scholarshipId}`);
            console.log('Bourse supprimée des favoris:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur suppression bourse:', error);
            throw error;
        }
    },

    // Récupérer les bourses sauvegardées par l'utilisateur
    getSavedScholarships: async () => {
        try {
            const response = await api.get('/users/me/saved-scholarships');
            console.log('Bourses sauvegardées:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur chargement bourses sauvegardées:', error);
            return [];
        }
    }
};