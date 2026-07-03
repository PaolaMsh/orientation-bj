import api from './api';

const RIASEC_AXES = ['REALISTIC', 'INVESTIGATIVE', 'ARTISTIC', 'SOCIAL', 'ENTERPRISING', 'CONVENTIONAL'];

const riasecMapping = {
    'R': 'REALISTIC',
    'I': 'INVESTIGATIVE',
    'A': 'ARTISTIC',
    'S': 'SOCIAL',
    'E': 'ENTERPRISING',
    'C': 'CONVENTIONAL',
};

export const recommendationService = {
    fetchCareerRecommendations: async (assessmentId) => {
        const sessionToken = localStorage.getItem('session_token');
        if (!sessionToken) {
            throw new Error('X-Session-Token manquant');
        }
        
        const response = await api.get('/careers/career-recommendations', {
            params: {
                assessmentId,
                limit: 20,
                category: 'NUMERIQUE',
                force: true,
                advanced: true,
            },
            headers: {
                'X-Session-Token': sessionToken,
            },
        });
        
        return response.data;
    },

    fetchFormationRecommendations: async (assessmentId) => {
        const sessionToken = localStorage.getItem('session_token');
        if (!sessionToken) {
            throw new Error('X-Session-Token manquant');
        }

        const response = await api.get('/careers/formation-recommendations', {
            params: {
                assessmentId,
                limit: 20,
                category: 'NUMERIQUE',
                force: true,
                advanced: true,
            },
            headers: {
                'X-Session-Token': sessionToken,
            },
        });
        
        return response.data;
    },

    getRiasecRecommendations: async (assessmentId) => {
        try {
            const [careersData, formationsData] = await Promise.all([
                recommendationService.fetchCareerRecommendations(assessmentId).catch(() => []),
                recommendationService.fetchFormationRecommendations(assessmentId).catch(() => []),
            ]);
            
            const careersList = careersData.map(item => ({
                name: item.career?.name,
                codes: item.career?.riasecCodes || []
            })).filter(c => c.name);
            
            const formationsList = formationsData.map(item => ({
                name: item.formation?.name || item.formation?.title,
                school: item.university?.name
            })).filter(f => f.name);
            
            const recommendationsByAxis = {};
            
            RIASEC_AXES.forEach(axis => {
                recommendationsByAxis[axis] = {
                    formations: [],
                    metiers: [],
                    ecoles: []
                };
            });
            
            careersList.forEach(career => {
                if (career.codes.length === 0) {
                    if (!recommendationsByAxis.INVESTIGATIVE.metiers.includes(career.name)) {
                        recommendationsByAxis.INVESTIGATIVE.metiers.push(career.name);
                    }
                } else {
                    career.codes.forEach(code => {
                        const axis = riasecMapping[code];
                        if (axis && !recommendationsByAxis[axis].metiers.includes(career.name)) {
                            recommendationsByAxis[axis].metiers.push(career.name);
                        }
                    });
                }
            });
            
            const axesWithMetiers = RIASEC_AXES.filter(axis => recommendationsByAxis[axis].metiers.length > 0);
            const targetAxes = axesWithMetiers.length > 0 ? axesWithMetiers : ['INVESTIGATIVE'];
            
            formationsList.forEach(formation => {
                targetAxes.forEach(axis => {
                    if (!recommendationsByAxis[axis].formations.includes(formation.name)) {
                        recommendationsByAxis[axis].formations.push(formation.name);
                    }
                    if (formation.school && !recommendationsByAxis[axis].ecoles.includes(formation.school)) {
                        recommendationsByAxis[axis].ecoles.push(formation.school);
                    }
                });
            });
            
            RIASEC_AXES.forEach(axis => {
                recommendationsByAxis[axis].metiers = recommendationsByAxis[axis].metiers.slice(0, 10);
                recommendationsByAxis[axis].formations = recommendationsByAxis[axis].formations.slice(0, 10);
                recommendationsByAxis[axis].ecoles = recommendationsByAxis[axis].ecoles.slice(0, 10);
            });
            
            const allCareers = careersList.map(c => c.name);
            const allFormations = formationsList.map(f => f.name);
            
            return {
                careers: allCareers,
                formations: allFormations,
                recommendationsByAxis: recommendationsByAxis,
            };
            
        } catch (error) {
            console.error('Erreur getRiasecRecommendations:', error);
            const emptyRecommendations = {};
            RIASEC_AXES.forEach(axis => {
                emptyRecommendations[axis] = { formations: [], metiers: [], ecoles: [] };
            });
            return {
                careers: [],
                formations: [],
                recommendationsByAxis: emptyRecommendations,
            };
        }
    },
    saveRecommendationsToDatabase: async (assessmentId, recommendations, phase = 'phase1') => {
        try {
            const response = await api.post(`/assessments/${assessmentId}/recommendations`, {
                recommendations: recommendations,
                phase: phase
            });
            console.log('✅ Recommandations sauvegardées en base:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur sauvegarde en base:', error);
            throw error;
        }
    },

    /**
     * ✅ Récupérer les recommandations depuis la base de données
     */
    getRecommendationsFromDatabase: async (assessmentId) => {
        try {
            const response = await api.get(`/assessments/${assessmentId}/recommendations/saved`);
            return response.data?.recommendations || null;
        } catch (error) {
            if (error.response?.status === 404) {
                return null; // Pas encore sauvegardé
            }
            console.error('❌ Erreur récupération base:', error);
            throw error;
        }
    },

    /**
     * ✅ Méthode principale avec priorité BASE DE DONNÉES
     * Utilise cette méthode au lieu de getRiasecRecommendations directement
     */
    getRiasecRecommendationsWithDB: async (assessmentId, leadingLetter) => {
        // 1. ✅ ESSAYER LA BASE DE DONNÉES D'ABORD
        try {
            const dbRecos = await recommendationService.getRecommendationsFromDatabase(assessmentId);
            if (dbRecos) {
                console.log('📦 Recommandations récupérées depuis la BASE DE DONNÉES');
                
                // Vérifier si l'axe demandé existe
                if (leadingLetter) {
                    const axisMapping = {
                        'R': 'REALISTIC', 'I': 'INVESTIGATIVE', 'A': 'ARTISTIC',
                        'S': 'SOCIAL', 'E': 'ENTERPRISING', 'C': 'CONVENTIONAL'
                    };
                    const dominantAxis = axisMapping[leadingLetter] || 'INVESTIGATIVE';
                    
                    // Si l'axe n'existe pas, utiliser INVESTIGATIVE par défaut
                    if (!dbRecos.recommendationsByAxis?.[dominantAxis]) {
                        // Créer l'axe avec des données vides
                        dbRecos.recommendationsByAxis = dbRecos.recommendationsByAxis || {};
                        dbRecos.recommendationsByAxis[dominantAxis] = {
                            formations: ['Aucune formation disponible'],
                            metiers: ['Aucun métier disponible'],
                            ecoles: ['Aucune école disponible']
                        };
                    }
                }
                
                return dbRecos;
            }
        } catch (dbError) {
            console.warn('⚠️ Erreur lecture base, fallback API:', dbError.message);
        }

        // 2. 🔄 FALLBACK VERS L'API
        console.log('🔍 Récupération des recommandations depuis l\'API...');
        
        try {
            const recoData = await recommendationService.getRiasecRecommendations(assessmentId);
            
            // 3. 💾 SAUVEGARDER EN BASE POUR LA PROCHAINE FOIS
            try {
                await recommendationService.saveRecommendationsToDatabase(
                    assessmentId, 
                    recoData, 
                    leadingLetter ? 'phase1' : 'full'
                );
                console.log('✅ Recommandations sauvegardées en base');
            } catch (saveErr) {
                console.warn('⚠️ Impossible de sauvegarder en base:', saveErr.message);
            }
            
            return recoData;
        } catch (apiError) {
            console.error('❌ Erreur API:', apiError);
            
            // 4. 📦 DERNIER RECOURS : Données mockées pour éviter l'écran vide
            const emptyRecos = {
                careers: [],
                formations: [],
                recommendationsByAxis: {}
            };
            
            RIASEC_AXES.forEach(axis => {
                emptyRecos.recommendationsByAxis[axis] = {
                    formations: ['Information non disponible'],
                    metiers: ['Information non disponible'],
                    ecoles: ['Information non disponible']
                };
            });
            
            // Si un axe spécifique est demandé, s'assurer qu'il existe
            if (leadingLetter) {
                const axisMapping = {
                    'R': 'REALISTIC', 'I': 'INVESTIGATIVE', 'A': 'ARTISTIC',
                    'S': 'SOCIAL', 'E': 'ENTERPRISING', 'C': 'CONVENTIONAL'
                };
                const dominantAxis = axisMapping[leadingLetter] || 'INVESTIGATIVE';
                
                if (!emptyRecos.recommendationsByAxis[dominantAxis]) {
                    emptyRecos.recommendationsByAxis[dominantAxis] = {
                        formations: ['Information non disponible'],
                        metiers: ['Information non disponible'],
                        ecoles: ['Information non disponible']
                    };
                }
            }
            
            return emptyRecos;
        }
    }
};
