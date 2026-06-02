// services/authService.jsx (CORRIGÉ)
import api from './api';

/**
 * Verify email token with backend
 * @param {string} token - verification token (query string)
 * @returns {Promise<any>} response data
 */
export const verifyEmail = async (token) => {
  if (!token || typeof token !== 'string') {
    throw new Error('Token invalide');
  }

  try {
    // ✅ Utilisez GET avec params (comme dans la doc)
    const response = await api.get('/auth/verify-email', {
      params: { token }  // Devient: /auth/verify-email?token=xxx
    });
    
    return response.data;
  } catch (error) {
    console.error('Verify email error:', error.response?.data);
    
    if (error.response?.data) {
      const apiError = error.response.data;
      throw new Error(apiError.message || 'Erreur de vérification');
    }
    throw error;
  }
};

export default { verifyEmail };