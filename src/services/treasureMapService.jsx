// Importer le service en haut du fichier
import { treasureMapService } from '../services/treasureMapService';

// Remplacer la fonction exportAssessmentPdf
const exportAssessmentPdf = useCallback(async (assessment) => {
    if (!assessment) return;

    setSavingPdfId(assessment.id);

    try {
        console.log('📄 Téléchargement du rapport pour:', assessment.assessmentId);
        console.log('🔑 Session Token:', assessment.sessionToken);

        // ✅ Télécharger le PDF via le service (génère automatiquement si besoin)
        await treasureMapService.downloadAndSavePdf(
            assessment,
            `Rapport_${assessment.type || 'RIASEC'}_${assessment.assessmentId}.pdf`,
            (message, progress) => {
                console.log(`Progression: ${progress}% - ${message}`);
            }
        );

        console.log('✅ Rapport téléchargé avec succès');
        
        // Optionnel: Message de succès
        setSaveMessage({
            id: assessment.id,
            text: '✅ Rapport téléchargé avec succès !',
            type: 'success'
        });
        setTimeout(() => setSaveMessage(null), 3000);

    } catch (error) {
        console.error('❌ Erreur lors du téléchargement du rapport:', error);
        
        // 🔄 Fallback: Générer un PDF simple avec les données disponibles
        try {
            console.log('📄 Utilisation du fallback...');
            await generateSimplePdf(assessment);
        } catch (fallbackError) {
            console.error('❌ Erreur fallback:', fallbackError);
            setSaveMessage({
                id: assessment.id,
                text: '❌ Erreur lors du téléchargement. Veuillez réessayer.',
                type: 'error'
            });
            setTimeout(() => setSaveMessage(null), 3000);
        }
    } finally {
        setSavingPdfId(null);
    }
}, []);

// Fonction de fallback pour générer un PDF simple
const generateSimplePdf = useCallback(async (assessment) => {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    let yPosition = 20;

    const title = assessment.type === 'PHASE1' ? 'Rapport Phase 1' : 'Rapport RIASEC';
    const code = assessment.code || 'N/A';

    // En-tête
    pdf.setFillColor(51, 71, 223);
    pdf.rect(0, 0, 210, 45, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.text(title, 20, 25);
    pdf.setFontSize(11);
    pdf.text(`Date: ${assessment.date}`, 20, 36);

    yPosition = 55;

    // Informations du test
    pdf.setTextColor(17, 24, 39);
    pdf.setFontSize(14);
    pdf.text(`Code RIASEC: ${code}`, 20, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(11);
    pdf.text(`Statut: ${STATUS_LABELS[assessment.status] || assessment.status}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Cohérence: ${assessment.consistencyLevel || 'Non renseignée'}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Complétion: ${assessment.completionPercentage}%`, 20, yPosition);
    yPosition += 12;

    // Essayer de récupérer les recommandations
    try {
        const recoResponse = await api.get(
            `/users/me/assessments/${assessment.assessmentId}/recommendations`,
            { params: { limit: 20 } }
        );
        const recos = recoResponse.data;

        if (recos) {
            // Métiers
            if (recos.careers && recos.careers.length > 0) {
                if (yPosition > 250) {
                    pdf.addPage();
                    yPosition = 20;
                }
                pdf.setFontSize(13);
                pdf.setTextColor(51, 71, 223);
                pdf.text('🎯 Métiers recommandés', 20, yPosition);
                yPosition += 10;
                pdf.setFontSize(10);
                pdf.setTextColor(17, 24, 39);
                recos.careers.slice(0, 15).forEach((career) => {
                    const name = typeof career === 'string' ? career : career.name || career;
                    pdf.text(`• ${name}`, 25, yPosition);
                    yPosition += 6;
                    if (yPosition > 275) {
                        pdf.addPage();
                        yPosition = 20;
                    }
                });
                yPosition += 4;
            }

            // Formations
            if (recos.trainings && recos.trainings.length > 0) {
                if (yPosition > 250) {
                    pdf.addPage();
                    yPosition = 20;
                }
                pdf.setFontSize(13);
                pdf.setTextColor(51, 71, 223);
                pdf.text('📚 Formations recommandées', 20, yPosition);
                yPosition += 10;
                pdf.setFontSize(10);
                pdf.setTextColor(17, 24, 39);
                recos.trainings.slice(0, 15).forEach((training) => {
                    const name = typeof training === 'string' ? training : training.name || training;
                    pdf.text(`• ${name}`, 25, yPosition);
                    yPosition += 6;
                    if (yPosition > 275) {
                        pdf.addPage();
                        yPosition = 20;
                    }
                });
                yPosition += 4;
            }

            // Écoles
            if (recos.schools && recos.schools.length > 0) {
                if (yPosition > 250) {
                    pdf.addPage();
                    yPosition = 20;
                }
                pdf.setFontSize(13);
                pdf.setTextColor(51, 71, 223);
                pdf.text('🎓 Écoles / Universités', 20, yPosition);
                yPosition += 10;
                pdf.setFontSize(10);
                pdf.setTextColor(17, 24, 39);
                recos.schools.slice(0, 15).forEach((school) => {
                    const name = typeof school === 'string' ? school : school.name || school;
                    pdf.text(`• ${name}`, 25, yPosition);
                    yPosition += 6;
                    if (yPosition > 275) {
                        pdf.addPage();
                        yPosition = 20;
                    }
                });
                yPosition += 4;
            }
        }
    } catch (error) {
        console.warn('⚠️ Impossible de récupérer les recommandations pour le fallback');
    }

    // Sources
    if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
    }
    pdf.setFontSize(12);
    pdf.setTextColor(51, 71, 223);
    pdf.text('📋 Sources du rapport', 20, yPosition);
    yPosition += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(17, 24, 39);
    pdf.text(`Session: ${assessment.sessionToken || 'non disponible'}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Assessment ID: ${assessment.assessmentId}`, 20, yPosition);

    // Pied de page
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        pdf.text(
            `Rapport généré le ${new Date().toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })} - Page ${i}/${pageCount}`,
            20,
            285
        );
    }

    pdf.save(`Rapport_${assessment.assessmentId}.pdf`);
    console.log('✅ Fallback PDF généré avec succès');
}, [api]);