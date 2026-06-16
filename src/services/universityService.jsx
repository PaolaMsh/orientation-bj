import api from './api';

// Fonction pour construire l'URL de l'image
const getImageUrl = (coverUrl) => {
    if (!coverUrl) {
        return null;
    }

    // Si l'URL contient localhost:5173, la remplacer
    if (coverUrl.includes('localhost:5173')) {
        const productionUrl = 'https://api-orientation-production.up.railway.app';
        return coverUrl.replace('http://localhost:5173', productionUrl);
    }

    // Si l'URL contient localhost:5000, la remplacer
    if (coverUrl.includes('localhost:5000')) {
        const productionUrl = 'https://api-orientation-production.up.railway.app';
        return coverUrl.replace('http://localhost:5000', productionUrl);
    }

    // Si l'URL est déjà absolue
    if (coverUrl.startsWith('http://') || coverUrl.startsWith('https://')) {
        return coverUrl;
    }

    // Si c'est un chemin relatif
    const API_BASE_URL = 'https://api-orientation-production.up.railway.app';
    const cleanUrl = coverUrl.startsWith('/') ? coverUrl : `/${coverUrl}`;
    return `${API_BASE_URL}${cleanUrl}`;
};

export const universityService = {
    getAllUniversities: async () => {
        try {
            const response = await api.get('/universities');
            console.log('Données brutes:', response.data);
            
            // Transformer les données avec les bonnes URLs d'images
            const processedData = response.data.map(uni => {
                const imageUrl = getImageUrl(uni.coverUrl);
                console.log(`Université ${uni.name}:`, {
                    original: uni.coverUrl,
                    transformed: imageUrl
                });
                return {
                    ...uni,
                    image: imageUrl // Ajouter la propriété image
                };
            });
            
            return processedData;
        } catch (error) {
            console.error('Erreur chargement universités:', error);
            throw error;
        }
    },

    getUniversityById: async (id) => {
        try {
            const response = await api.get(`/universities/${id}`);
            return {
                ...response.data,
                image: getImageUrl(response.data.coverUrl)
            };
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
            const response = await api.get(url);
            
            // Transformer les résultats de recherche
            const processedData = response.data.map(uni => ({
                ...uni,
                image: getImageUrl(uni.coverUrl)
            }));
            
            return processedData;
        } catch (error) {
            console.error(`Erreur lors de la recherche:`, error);
            throw error;
        }
    },
};