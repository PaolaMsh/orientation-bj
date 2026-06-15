import api from './api';

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
        const response = await api.get('/auth/verify-email', {
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
