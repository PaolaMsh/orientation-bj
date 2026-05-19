// services/formationService.js
import api from './api';

const API_BASE_URL = 'https://api-orientation-production.up.railway.app/api/v1';

export const formationService = {
    // Obtenir toutes les formations d'une université spécifique
    getFormationsByUniversityId: async (universityId) => {
        try {
            if (!universityId) {
                throw new Error('universityId est requis');
            }
            const response = await api.get(`/formations/university/${universityId}`);
            return response.data;
        } catch (error) {
            console.error(
                `Erreur lors de la récupération des formations pour l'université ${universityId}:`,
                error,
            );
            throw error;
        }
    },

    // Rechercher des formations par mot-clé (nom, description, etc.)
    searchFormations: async (query) => {
        try {
            if (!query || query.trim() === '') {
                return [];
            }
            const response = await api.get(
                `/formations/search?q=${encodeURIComponent(query.trim())}`,
            );
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la recherche de formations pour "${query}":`, error);
            throw error;
        }
    },

    // Obtenir une formation par son ID
    getFormationById: async (id) => {
        try {
            if (!id) {
                throw new Error('id est requis');
            }
            const response = await api.get(`/formations/${id}`);
            console.log('Formation récupérée:', response.data);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération de la formation ${id}:`, error);
            throw error;
        }
    },

    // Obtenir toutes les formations (avec filtre optionnel par université)
    getAllFormations: async (universityId = null) => {
        try {
            if (universityId) {
                return await formationService.getFormationsByUniversityId(universityId);
            }
            // Si pas d'université spécifique, on peut faire une recherche vide ou appeler un endpoint général
            const response = await api.get('/formations');
            console.log('Toutes les formations récupérées:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de toutes les formations:', error);
            throw error;
        }
    },
};
