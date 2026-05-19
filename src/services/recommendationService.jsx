import api from './api';

const normalizeToArray = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== 'object') return [];
    return payload.data || payload.results || payload.items || payload.formations || [];
};

const formatRecommendationsForRIASEC = (apiData) => {
    const result = {
        REALISTIC: { formations: [], metiers: [], ecoles: [] },
        INVESTIGATIVE: { formations: [], metiers: [], ecoles: [] },
        ARTISTIC: { formations: [], metiers: [], ecoles: [] },
        SOCIAL: { formations: [], metiers: [], ecoles: [] },
        ENTERPRISING: { formations: [], metiers: [], ecoles: [] },
        CONVENTIONAL: { formations: [], metiers: [], ecoles: [] },
    };

    const recommendationsList = normalizeToArray(apiData);
    if (!recommendationsList.length) {
        return result;
    }

    const riasecMapping = {
        R: 'REALISTIC',
        I: 'INVESTIGATIVE',
        A: 'ARTISTIC',
        S: 'SOCIAL',
        E: 'ENTERPRISING',
        C: 'CONVENTIONAL',
    };

    const hasCareerPayload = recommendationsList.some((item) => item && item.career);
    const dominantAxesFromCareers = [];

    recommendationsList.forEach((item) => {
        const career = item.career || {};
        const formation = item.formation || {};
        const university = item.university || {};

        const formationName =
            formation.name ||
            formation.title ||
            item.name ||
            item.title ||
            item.formation ||
            item.libelle ||
            'Formation';

        const metierName =
            career.name ||
            item.careerName ||
            item.metier ||
            item.profession ||
            item.name ||
            formationName;

        const ecoleName =
            university.name ||
            item.schoolName ||
            item.ecole ||
            item.university ||
            item.establishment ||
            item.organization;

        const riasecCodes = career.riasecCodes || item.riasecCodes || item.riasec_code || item.codes || [];

        if (riasecCodes.length > 0) {
            riasecCodes.forEach((code) => {
                const axis = riasecMapping[code];
                if (!axis || !result[axis]) return;
                dominantAxesFromCareers.push(axis);

                if (!result[axis].formations.includes(formationName)) {
                    result[axis].formations.push(formationName);
                }
                if (metierName && !result[axis].metiers.includes(metierName)) {
                    result[axis].metiers.push(metierName);
                }
                if (ecoleName && !result[axis].ecoles.includes(ecoleName)) {
                    result[axis].ecoles.push(ecoleName);
                }
            });
            return;
        }

        const fallbackAxes = hasCareerPayload
            ? [...new Set(dominantAxesFromCareers)].slice(0, 2)
            : Object.keys(result);
        const targetAxes = fallbackAxes.length > 0 ? fallbackAxes : Object.keys(result);

        targetAxes.forEach((axis) => {
            if (!result[axis].formations.includes(formationName)) {
                result[axis].formations.push(formationName);
            }
            if (metierName && !result[axis].metiers.includes(metierName)) {
                result[axis].metiers.push(metierName);
            }
            if (ecoleName && !result[axis].ecoles.includes(ecoleName)) {
                result[axis].ecoles.push(ecoleName);
            }
        });
    });

    Object.keys(result).forEach((axis) => {
        result[axis].formations = result[axis].formations.slice(0, 6);
        result[axis].metiers = result[axis].metiers.slice(0, 6);
        result[axis].ecoles = [...new Set(result[axis].ecoles)].slice(0, 6);
    });

    return result;
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
        console.log('Reco debug -> assessmentId:', assessmentId);
        console.log('Reco debug -> has session token:', Boolean(localStorage.getItem('session_token')));
        const [careerRecommendations, formationRecommendations] = await Promise.all([
            recommendationService.fetchCareerRecommendations(assessmentId).catch((error) => {
                console.error('Erreur career recommendations:', error?.response?.status, error?.message);
                return [];
            }),
            recommendationService.fetchFormationRecommendations(assessmentId).catch((error) => {
                console.error('Erreur formation recommendations:', error?.response?.status, error?.message);
                return [];
            }),
        ]);
        const careers = normalizeToArray(careerRecommendations)
            .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
            .slice(0, 20);
        const formations = normalizeToArray(formationRecommendations)
            .sort((a, b) => (b.score || 0) - (a.score || 0))
            .slice(0, 20);
        console.log('Reco debug -> careers count:', careers.length);
        console.log('Reco debug -> formations count:', formations.length);

        return formatRecommendationsForRIASEC([...careers, ...formations]);
    },
};
