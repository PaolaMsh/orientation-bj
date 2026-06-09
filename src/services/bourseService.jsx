import api from './api';

export const bourseService = {
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

    getScholarshipById: async (id) => {
        try {
            const response = await api.get(`/scholarships/${id}`);
            console.log('Bourses chargées:', response.data);

            return response.data;
        } catch (error) {
            console.error(`Erreur chargement bourses ${id}:`, error);
            throw error;
        }
    },

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
};
