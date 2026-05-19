import api from './api';

export const universityService = {
    getAllUniversities: async () => {
        try {
            const response = await api.get('/universities');
            console.log('Universités chargées:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur chargement universités:', error);
            throw error;
        }
    },

    getUniversityById: async (id) => {
        try {
            const response = await api.get(`/universities/${id}`);
            console.log('Universités chargées:', response.data);

            return response.data;
        } catch (error) {
            console.error(`Erreur chargement université ${id}:`, error);
            throw error;
        }
    },

    searchUniversities: async (query) => {
        try {
            if (!query || query.trim() === '') {
                return [];
            }

            const url = `/universities/search/?q=${encodeURIComponent(query.trim())}`;
            console.log('URL complète:', api.defaults.baseURL + url);

            const response = await api.get(url);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la recherche pour "${query}":`, error);
            console.error("Détails de l'erreur:", error.response?.data);
            throw error;
        }
    },
};
