// src/services/bourseService.js
import api from './api';

export const bourseService = {
    // Récupérer toutes les bourses disponibles
    getAllScholarships: async () => {
        try {
            const response = await api.get('/scholarships');
            return response.data;
        } catch (error) {
            console.error('Erreur chargement bourses:', error);
            throw error;
        }
    },

    // ✅ Sauvegarder une bourse (POST avec paramètre PATH)
    saveScholarship: async (scholarshipId) => {
        try {
            const response = await api.post(`/users/me/scholarship/${scholarshipId}`);
            console.log('✅ Bourse sauvegardée:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur sauvegarde bourse:', error);
            throw error;
        }
    },

    // ✅ Supprimer une bourse (DELETE avec paramètre PATH)
    removeSavedScholarship: async (scholarshipId) => {
        try {
            const response = await api.delete(`/users/me/scholarship/${scholarshipId}`);
            console.log('✅ Bourse supprimée:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur suppression bourse:', error);
            throw error;
        }
    },

    // ✅ Récupérer UNE bourse spécifique (GET avec paramètre QUERY)
    getSpecificSavedScholarship: async (scholarshipId) => {
        try {
            const response = await api.get('/users/me/scholarship', {
                params: { scholarshipId }
            });
            console.log('✅ Bourse spécifique récupérée:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur récupération bourse:', error);
            throw error;
        }
    },

    // ✅ Récupérer TOUTES les bourses sauvegardées en les récupérant une par une
    getAllSavedScholarships: async () => {
        try {
            // 1. Récupérer les IDs depuis localStorage
            const localSaved = localStorage.getItem('savedScholarships');
            if (!localSaved) {
                return [];
            }
            
            const savedIds = JSON.parse(localSaved);
            if (savedIds.length === 0) {
                return [];
            }
            
            console.log(`📚 Récupération de ${savedIds.length} bourses depuis la base de données...`);
            
            // 2. Récupérer chaque bourse individuellement depuis l'API
            const scholarships = [];
            const errors = [];
            
            for (const item of savedIds) {
                try {
                    const scholarshipId = item.id || item;
                    const response = await bourseService.getSpecificSavedScholarship(scholarshipId);
                    
                    if (response && response.data) {
                        // Combiner les données de l'API avec les données locales
                        const apiData = response.data;
                        scholarships.push({
                            id: apiData.id || scholarshipId,
                            title: apiData.title || apiData.name || item.title || 'Bourse',
                            description: apiData.description || item.description || '',
                            country: apiData.country || item.country || '',
                            university: apiData.university || item.university || '',
                            type: apiData.type || item.type || '',
                            level: apiData.level || item.level || '',
                            amount: apiData.amount || item.amount || '',
                            link: apiData.link || apiData.applicationUrl || item.link || '',
                            emoji: apiData.emoji || item.emoji || '🎓',
                            savedAt: item.savedAt || new Date().toISOString(),
                            // Conserver les données locales si l'API ne les a pas
                            ...item,
                            // Surcharger avec les données de l'API si disponibles
                            ...(apiData.data || apiData)
                        });
                    } else {
                        // Si l'API ne renvoie rien, utiliser les données locales
                        scholarships.push(item);
                    }
                } catch (error) {
                    console.warn(`⚠️ Erreur récupération bourse ${item.id || item}:`, error);
                    errors.push({ id: item.id || item, error: error.message });
                    // En cas d'erreur, garder la version locale
                    scholarships.push(item);
                }
            }
            
            console.log(`✅ ${scholarships.length} bourses récupérées (${errors.length} erreurs)`);
            
            // Mettre à jour localStorage avec les données fraîches
            localStorage.setItem('savedScholarships', JSON.stringify(scholarships));
            
            return scholarships;
        } catch (error) {
            console.error('❌ Erreur récupération toutes les bourses:', error);
            // Fallback vers localStorage
            const localSaved = localStorage.getItem('savedScholarships');
            return localSaved ? JSON.parse(localSaved) : [];
        }
    },

    // ✅ Vérifier si une bourse est sauvegardée (en utilisant l'API)
    isScholarshipSaved: async (scholarshipId) => {
        try {
            await bourseService.getSpecificSavedScholarship(scholarshipId);
            return true;
        } catch (error) {
            if (error.response?.status === 404) {
                return false;
            }
            // En cas d'erreur, vérifier dans localStorage
            const saved = bourseService.getSavedScholarships();
            return saved.some(s => s.id === scholarshipId);
        }
    },

    // ✅ Récupérer depuis localStorage (rapide)
    getSavedScholarships: () => {
        try {
            const localSaved = localStorage.getItem('savedScholarships');
            if (localSaved) {
                return JSON.parse(localSaved);
            }
            return [];
        } catch (error) {
            console.error('❌ Erreur chargement bourses locales:', error);
            return [];
        }
    }
};