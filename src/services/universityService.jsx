import api from './api';
import { getImageUrl } from '../utils/imageUtils';

export const universityService = {
    getAllUniversities: async () => {
        try {
            const response = await api.get('/universities');
            console.log('Universités chargées:', response.data);
            
            // Ajouter l'URL complète de l'image à chaque université
            const universitiesWithImages = response.data.map((uni) => ({
                ...uni,
                coverUrl: getImageUrl(uni.coverUrl),
                // Garder une copie de l'URL brute si nécessaire
                rawCoverUrl: uni.coverUrl
            }));
            
            return universitiesWithImages;
        } catch (error) {
            console.error('Erreur chargement universités:', error);
            throw error;
        }
    },

    getUniversityById: async (id) => {
        try {
            const response = await api.get(`/universities/${id}`);
            console.log('Université chargée:', response.data);
            
            // Ajouter l'URL complète de l'image
            const university = {
                ...response.data,
                coverUrl: getImageUrl(response.data.coverUrl),
                rawCoverUrl: response.data.coverUrl
            };
            
            return university;
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
            
            // Ajouter l'URL complète de l'image à chaque résultat
            const universitiesWithImages = response.data.map((uni) => ({
                ...uni,
                coverUrl: getImageUrl(uni.coverUrl),
                rawCoverUrl: uni.coverUrl
            }));
            
            return universitiesWithImages;
        } catch (error) {
            console.error(`Erreur lors de la recherche pour "${query}":`, error);
            console.error("Détails de l'erreur:", error.response?.data);
            throw error;
        }
    },
};