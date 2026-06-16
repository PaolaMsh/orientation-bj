import axios from 'axios';

const FALLBACK_API_BASE_URL = 'https://api-orientation-production.up.railway.app/api/v1';
const API_BASE_URL = import.meta.env.VITE_API_URL || FALLBACK_API_BASE_URL;

const publicApi = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

/**
 * Verify email token with backend.
 * Calls GET /auth/verify-email?token=...
 * @param {string} token - verification token from the URL query string
 * @returns {Promise<any>} response data
 */
export const verifyEmail = async (token) => {
    if (!token || typeof token !== 'string') {
        throw new Error('Token invalide');
    }

    try {
        const response = await publicApi.get('/auth/verify-email', {
            params: { token },
        });

        return response.data;
    } catch (error) {
        const apiError = error.response?.data;
        if (apiError?.details?.length) {
            throw new Error(apiError.details.join(', '));
        }

        throw new Error(apiError?.message || 'Token invalide ou expiré');
    }
};

export default { verifyEmail };
