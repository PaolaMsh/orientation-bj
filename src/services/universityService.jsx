import api from './api';
import { getFullImageUrl } from '../utils/imageUtils';

export const universityService = {
    getAllUniversities: async () => {
        try {
            const response = await api.get('/universities');
            console.log('Universités reçues:', response.data);
            
            // Traiter chaque université pour corriger les URLs des images
            const processedData = response.data.map((university) => {
                const processedUni = {
                    ...university,
                    // Ajouter l'URL complète de l'image
                    imageUrl: getFullImageUrl(university.coverUrl),
                    // Garder l'URL originale pour débogage
                    rawCoverUrl: university.coverUrl
                };
                return processedUni;
            });
            
            console.log('Universités traitées avec URLs d\'images:', processedData);
            return processedData;
        } catch (error) {
            console.error('Erreur chargement universités:', error);
            throw error;
        }
    },

    getUniversityById: async (id) => {
        try {
            const response = await api.get(`/universities/${id}`);
            console.log('Université reçue:', response.data);

            const processedData = {
                ...response.data,
                imageUrl: getFullImageUrl(response.data.coverUrl),
                rawCoverUrl: response.data.coverUrl
            };

            return processedData;
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
            console.log('URL de recherche:', api.defaults.baseURL + url);

            const response = await api.get(url);
            
            // Traiter les résultats de recherche
            const processedData = response.data.map((university) => ({
                ...university,
                imageUrl: getFullImageUrl(university.coverUrl),
                rawCoverUrl: university.coverUrl
            }));
            
            return processedData;
        } catch (error) {
            console.error(`Erreur lors de la recherche pour "${query}":`, error);
            console.error("Détails de l'erreur:", error.response?.data);
            throw error;
        }
    },
};