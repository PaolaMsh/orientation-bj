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
        
        // response.data est un tableau direct
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
        
        // response.data est un tableau direct
        return response.data;
    },

    getRiasecRecommendations: async (assessmentId) => {
        try {
            // Récupérer les deux types de données
            const [careersData, formationsData] = await Promise.all([
                recommendationService.fetchCareerRecommendations(assessmentId).catch(() => []),
                recommendationService.fetchFormationRecommendations(assessmentId).catch(() => []),
            ]);
            
            // Extraire les noms des métiers et leurs codes RIASEC
            const careersList = careersData.map(item => ({
                name: item.career?.name,
                codes: item.career?.riasecCodes || []
            })).filter(c => c.name);
            
            // Extraire les noms des formations et écoles
            const formationsList = formationsData.map(item => ({
                name: item.formation?.name || item.formation?.title,
                school: item.university?.name
            })).filter(f => f.name);
            
            // Construire les recommandations par axe
            const recommendationsByAxis = {};
            
            // Initialiser chaque axe
            RIASEC_AXES.forEach(axis => {
                recommendationsByAxis[axis] = {
                    formations: [],
                    metiers: [],
                    ecoles: []
                };
            });
            
            // Répartir les métiers selon leurs codes RIASEC
            careersList.forEach(career => {
                if (career.codes.length === 0) {
                    // Si pas de code, mettre dans INVESTIGATIVE par défaut
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
            
            // Déterminer les axes qui ont des métiers
            const axesWithMetiers = RIASEC_AXES.filter(axis => recommendationsByAxis[axis].metiers.length > 0);
            const targetAxes = axesWithMetiers.length > 0 ? axesWithMetiers : ['INVESTIGATIVE'];
            
            // Ajouter les formations et écoles aux axes cibles
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
            
            // Limiter à 10 éléments par axe
            RIASEC_AXES.forEach(axis => {
                recommendationsByAxis[axis].metiers = recommendationsByAxis[axis].metiers.slice(0, 10);
                recommendationsByAxis[axis].formations = recommendationsByAxis[axis].formations.slice(0, 10);
                recommendationsByAxis[axis].ecoles = recommendationsByAxis[axis].ecoles.slice(0, 10);
            });
            
            // Liste globale des métiers et formations
            const allCareers = careersList.map(c => c.name);
            const allFormations = formationsList.map(f => f.name);
            
            return {
                careers: allCareers,
                formations: allFormations,
                recommendationsByAxis: recommendationsByAxis,
            };
            
        } catch (error) {
            console.error('Erreur getRiasecRecommendations:', error);
            // Retourner une structure vide mais valide
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
};