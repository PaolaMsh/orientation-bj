// services/treasureMapService.js
import api from './api';

export const treasureMapService = {
    /**
     * Génère ou récupère la treasure map pour un assessment
     * @param {string} sessionToken - Token de session
     * @param {string} assessmentId - ID de l'assessment (optionnel)
     * @param {boolean} generatePdf - Si true, génère un PDF
     * @returns {Promise} - Données de la treasure map
     */
    generateTreasureMap: async (sessionToken, assessmentId = null, generatePdf = false) => {
        try {
            const response = await api.post('/treasure-map', {
                sessionToken,
                assessmentId,
                generatePdf
            });
            return response.data;
        } catch (error) {
            console.error('❌ Erreur génération treasure map:', error);
            throw error;
        }
    },

    /**
     * Récupère la treasure map par token de session
     * @param {string} sessionToken - Token de session
     * @returns {Promise} - Données de la treasure map
     */
    getTreasureMapByToken: async (sessionToken) => {
        try {
            const response = await api.get(`/treasure-map/by-token/${sessionToken}`);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur récupération treasure map:', error);
            throw error;
        }
    },

    /**
     * Récupère le PDF de la treasure map par shareToken
     * @param {string} shareToken - Token de partage
     * @returns {Promise} - Blob du PDF
     */
    getTreasureMapPdf: async (shareToken) => {
        try {
            const response = await api.get(`/treasure-map/pdf/${shareToken}`, {
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            console.error('❌ Erreur récupération PDF:', error);
            throw error;
        }
    },

    /**
     * Récupère les données de la treasure map par shareToken
     * @param {string} shareToken - Token de partage
     * @returns {Promise} - Données de la treasure map
     */
    getTreasureMapByShareToken: async (shareToken) => {
        try {
            const response = await api.get(`/treasure-map/${shareToken}`);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur récupération treasure map par shareToken:', error);
            throw error;
        }
    },

    /**
     * Télécharge le rapport complet en PDF
     * @param {Object} assessment - L'assessment à exporter
     * @param {Function} onProgress - Callback de progression
     * @returns {Promise} - Le blob du PDF
     */
    downloadReportPdf: async (assessment, onProgress = null) => {
        try {
            if (onProgress) onProgress('Récupération des données...', 10);

            // 1. Récupérer la treasure map
            let treasureMapData = null;
            let shareToken = assessment.shareToken;

            if (!shareToken) {
                // Si pas de shareToken, générer la treasure map
                const generated = await treasureMapService.generateTreasureMap(
                    assessment.sessionToken,
                    assessment.assessmentId,
                    true
                );
                shareToken = generated.shareToken;
                treasureMapData = generated;
                if (onProgress) onProgress('Carte générée', 30);
            } else {
                // Récupérer la treasure map existante
                treasureMapData = await treasureMapService.getTreasureMapByShareToken(shareToken);
                if (onProgress) onProgress('Données récupérées', 30);
            }

            // 2. Récupérer le PDF
            if (onProgress) onProgress('Génération du PDF...', 60);
            const pdfBlob = await treasureMapService.getTreasureMapPdf(shareToken);
            
            if (onProgress) onProgress('PDF prêt', 90);

            return {
                blob: pdfBlob,
                shareToken: shareToken,
                data: treasureMapData
            };
        } catch (error) {
            console.error('❌ Erreur téléchargement rapport:', error);
            throw error;
        }
    },

    /**
     * Télécharge et sauvegarde le rapport en PDF
     * @param {Object} assessment - L'assessment à exporter
     * @param {string} fileName - Nom du fichier (optionnel)
     * @param {Function} onProgress - Callback de progression
     */
    downloadAndSavePdf: async (assessment, fileName = null, onProgress = null) => {
        try {
            const result = await treasureMapService.downloadReportPdf(assessment, onProgress);
            
            // Créer un lien de téléchargement
            const url = window.URL.createObjectURL(result.blob);
            const link = document.createElement('a');
            link.href = url;
            
            // Nom du fichier
            const defaultName = `Rapport_${assessment.type || 'RIASEC'}_${assessment.assessmentId}.pdf`;
            link.download = fileName || defaultName;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Nettoyer
            window.URL.revokeObjectURL(url);
            
            if (onProgress) onProgress('Téléchargement terminé', 100);
            
            return result;
        } catch (error) {
            console.error('❌ Erreur sauvegarde PDF:', error);
            throw error;
        }
    }
};

export default treasureMapService;