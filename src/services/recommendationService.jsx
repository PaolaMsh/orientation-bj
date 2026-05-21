import api from './api';

const normalizeToArray = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== 'object') return [];
    return payload.data || payload.results || payload.items || payload.formations || [];
};

const RIASEC_AXES = ['REALISTIC', 'INVESTIGATIVE', 'ARTISTIC', 'SOCIAL', 'ENTERPRISING', 'CONVENTIONAL'];

const createEmptyRiasecBuckets = () => ({
    REALISTIC: { formations: [], metiers: [], ecoles: [] },
    INVESTIGATIVE: { formations: [], metiers: [], ecoles: [] },
    ARTISTIC: { formations: [], metiers: [], ecoles: [] },
    SOCIAL: { formations: [], metiers: [], ecoles: [] },
    ENTERPRISING: { formations: [], metiers: [], ecoles: [] },
    CONVENTIONAL: { formations: [], metiers: [], ecoles: [] },
});

const mapCareerRecommendations = (payload) =>
    normalizeToArray(payload)
        .map((item) => ({
            id: item?.id,
            resultId: item?.resultId,
            careerId: item?.careerId ?? item?.career?.id,
            matchScore: Number(item?.matchScore) || 0,
            rankPosition: item?.rankPosition ?? null,
            career: item?.career ?? null,
        }))
        .filter((item) => item?.career?.id || item?.career?.name)
        .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
        .slice(0, 20);

const mapFormationRecommendations = (payload) =>
    normalizeToArray(payload)
        .map((item) => ({
            id: item?.id ?? `${item?.formation?.id || 'formation'}-${item?.university?.id || 'university'}`,
            score: Number(item?.score) || 0,
            formation: item?.formation ?? null,
            university: item?.university ?? null,
        }))
        .filter((item) => item?.formation?.id || item?.formation?.name || item?.formation?.title)
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 20);

const buildRecommendationsByAxis = (careers, formations) => {
    const result = {
        ...createEmptyRiasecBuckets(),
    };

    if (!careers.length && !formations.length) {
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

    careers.forEach((item) => {
        const career = item?.career;
        const metierName = career?.name;
        if (!metierName) return;

        const riasecCodes = Array.isArray(career?.riasecCodes) ? career.riasecCodes : [];
        const targetAxes = riasecCodes
            .map((code) => riasecMapping[code])
            .filter((axis) => Boolean(axis && result[axis]));

        const fallbackAxis = ['INVESTIGATIVE'];
        const axes = targetAxes.length > 0 ? targetAxes : fallbackAxis;

        axes.forEach((axis) => {
            if (!result[axis].metiers.includes(metierName)) {
                result[axis].metiers.push(metierName);
            }
        });
    });

    const dominantAxesFromCareers = RIASEC_AXES.filter(
        (axis) => result[axis].metiers.length > 0,
    ).slice(0, 2);
    const targetFormationAxes = dominantAxesFromCareers.length > 0 ? dominantAxesFromCareers : ['INVESTIGATIVE', 'REALISTIC'];

    formations.forEach((item) => {
        const formationName = item?.formation?.name || item?.formation?.title;
        const ecoleName = item?.university?.name;
        if (!formationName) return;

        targetFormationAxes.forEach((axis) => {
            if (!result[axis].formations.includes(formationName)) {
                result[axis].formations.push(formationName);
            }
            if (ecoleName && !result[axis].ecoles.includes(ecoleName)) {
                result[axis].ecoles.push(ecoleName);
            }
        });
    });

    RIASEC_AXES.forEach((axis) => {
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
        const careers = mapCareerRecommendations(careerRecommendations);
        const formations = mapFormationRecommendations(formationRecommendations);
        console.log('Reco debug -> careers count:', careers.length);
        console.log('Reco debug -> formations count:', formations.length);

        return {
            careers,
            formations,
            recommendationsByAxis: buildRecommendationsByAxis(careers, formations),
        };
    },
};
