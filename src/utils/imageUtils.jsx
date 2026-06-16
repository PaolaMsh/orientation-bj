// src/utils/imageUtils.js

/**
 * Construit l'URL complète d'une image
 * @param {string} coverUrl - L'URL relative ou absolue de l'image
 * @param {string} defaultImage - L'image par défaut si coverUrl est vide
 * @returns {string} L'URL complète de l'image
 */
export const getImageUrl = (coverUrl, defaultImage = '/images/default-university.jpg') => {
    if (!coverUrl) {
        return defaultImage;
    }

    // Si l'URL est déjà absolue (http ou https)
    if (coverUrl.startsWith('http://') || coverUrl.startsWith('https://')) {
        return coverUrl;
    }

    // Si l'URL contient localhost:5173, la remplacer par l'URL de production
    if (coverUrl.includes('localhost:5173')) {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://api-orientation-production.up.railway.app/api/v1';
        return coverUrl.replace('http://localhost:5173', apiUrl);
    }

    // Nettoyer l'URL (enlever les slashes en trop)
    const cleanUrl = coverUrl.startsWith('/') ? coverUrl : `/${coverUrl}`;
    
    // Utiliser l'URL de l'API
    const apiUrl = import.meta.env.VITE_API_URL || 'https://api-orientation-production.up.railway.app/api/v1';
    
    return `${apiUrl}${cleanUrl}`;
};

/**
 * Vérifie si une image existe
 * @param {string} url - L'URL de l'image à vérifier
 * @returns {Promise<boolean>} True si l'image existe
 */
export const checkImageExists = async (url) => {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
};