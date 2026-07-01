import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/orientations.css';
import { recommendationService } from '../services/recommendationService';
import api from '../services/api';

const IconInfo = () => (
    <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
);

const IconSearch = ({ size = 20 }) => (
    <svg
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const IconGrid = ({ size = 18 }) => (
    <svg
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
);

function RapportPhase1() {
    const navigate = useNavigate();
    const location = useLocation();
    const [rapportData, setRapportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [assessmentId, setAssessmentId] = useState(null);
    const [recommendations, setRecommendations] = useState({
        formations: [],
        metiers: [],
        ecoles: [],
    });

    // Fonction pour récupérer les recommandations
    const fetchRecommendations = async (id, phase1Code) => {
        try {
            const code = phase1Code || rapportData?.phase1Code || rapportData?.code || 'IND';
            const leadingLetter = String(code).charAt(0).toUpperCase();

            console.log('Code RIASEC Phase 1:', code);
            console.log('Première lettre (axe dominant):', leadingLetter);

            const recoData = await recommendationService.getRiasecRecommendations(
                id,
                leadingLetter,
            );
            console.log("Recommandations pour l'axe", leadingLetter, ':', recoData);

            const axisMapping = {
                R: 'REALISTIC',
                I: 'INVESTIGATIVE',
                A: 'ARTISTIC',
                S: 'SOCIAL',
                E: 'ENTERPRISING',
                C: 'CONVENTIONAL',
            };
            const dominantAxis = axisMapping[leadingLetter] || 'INVESTIGATIVE';

            const axisRecos = recoData.recommendationsByAxis?.[dominantAxis] || {};

            setRecommendations({
                formations: axisRecos.formations || [],
                metiers: axisRecos.metiers || [],
                ecoles: axisRecos.ecoles || [],
            });
        } catch (err) {
            console.error('Erreur chargement recommandations:', err);
            setRecommendations({
                formations: ['Information non disponible'],
                metiers: ['Information non disponible'],
                ecoles: ['Information non disponible'],
            });
        }
    };

    useEffect(() => {
        const fetchRapport = async () => {
            try {
                // 1. Vérifier si les données sont dans location.state
                const stateResults = location.state?.phaseResults;
                if (stateResults) {
                    setRapportData(stateResults);
                    const id = stateResults.assessmentId;
                    setAssessmentId(id);
                    await fetchRecommendations(id, stateResults.phase1Code);
                    return;
                }

                // 2. Vérifier si les données sont dans localStorage
                const storedReport = localStorage.getItem('phase1_report_data');
                if (storedReport) {
                    const parsed = JSON.parse(storedReport);
                    setRapportData(parsed);
                    const id = parsed.assessmentId;
                    setAssessmentId(id);
                    await fetchRecommendations(id, parsed.phase1Code);
                    return;
                }

                // 3. Récupérer depuis l'API
                const assessmentIdFromState = 
                    location.state?.assessmentId || localStorage.getItem('assessment_id');
                const sessionToken = 
                    location.state?.sessionToken || localStorage.getItem('session_token');

                if (!assessmentIdFromState) {
                    setError('Identifiant de test non trouvé');
                    return;
                }

                setAssessmentId(assessmentIdFromState);

                let response;
                try {
                    response = await api.get(`/results/by-assessment/${assessmentIdFromState}`);
                } catch (byAssessmentErr) {
                    response = await api.get('/results/phase1', {
                        params: { assessmentId: assessmentIdFromState, sessionToken },
                    });
                }

                const data = response?.data;
                setRapportData(data);
                await fetchRecommendations(assessmentIdFromState, data?.phase1Code);
            } catch (err) {
                console.error('Erreur lors du chargement du rapport:', err);
                setError(err.message || 'Erreur lors du chargement du rapport');
            } finally {
                setLoading(false);
            }
        };

        fetchRapport();
    }, [location.state]);

    // ✅ Fonction pour reprendre le test existant (là où on s'était arrêté)
    const handleResumeTest = () => {
        if (assessmentId) {
            navigate('/phaseText', {
                state: { 
                    assessmentId: assessmentId,
                    resume: true,
                    phase: 'phase1'
                }
            });
        } else {
            navigate('/tests-orientations');
        }
    };

    // ✅ Fonction pour recommencer le MÊME test depuis le début
    const handleRestartTest = () => {
        if (assessmentId) {
            // Supprimer uniquement les réponses sauvegardées pour ce test
            localStorage.removeItem(`phase1_responses_${assessmentId}`);
            localStorage.removeItem(`phase1_progress_${assessmentId}`);
            localStorage.removeItem('phase1_current_question');
            
            // Naviguer vers le test avec l'ID existant mais en mode restart
            navigate('/phaseText', {
                state: { 
                    assessmentId: assessmentId,
                    restart: true,  // 🔄 Indique qu'on recommence le test
                    phase: 'phase1'
                }
            });
        } else {
            // Si pas d'ID, aller vers la page de sélection
            navigate('/tests-orientations');
        }
    };

    // ✅ Fonction pour un tout nouveau test (avec un nouvel ID)
    const handleNewTest = () => {
        // Supprimer toutes les données
        localStorage.removeItem('phase1_report_data');
        localStorage.removeItem('assessment_id');
        localStorage.removeItem('phase1_responses');
        localStorage.removeItem('phase1_progress');
        localStorage.removeItem('phase1_current_question');
        
        // Naviguer vers un nouveau test
        navigate('/phaseText', {
            state: { 
                newTest: true,
                phase: 'phase1'
            }
        });
    };

    if (loading) {
        return (
            <div className="ori-page">
                <div className="ori-wrapper">
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <div className="spinner"></div>
                        <p>Calcul de votre rapport...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="ori-page">
                <div className="ori-wrapper">
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <p style={{ color: '#dc2626' }}>Erreur: {error}</p>
                        <button 
                            onClick={() => navigate('/tests-orientations')} 
                            className="button"
                        >
                            Retour
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!rapportData) {
        return (
            <div className="ori-page">
                <div className="ori-wrapper">
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <p>Aucune donnée disponible</p>
                        <button 
                            onClick={() => navigate('/tests-orientations')} 
                            className="button"
                        >
                            Retour
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const phase1Code = rapportData?.phase1Code || rapportData?.code || 'IND';
    const axisFromCode = {
        R: { code: 'REALISTIC', label: 'Réaliste' },
        I: { code: 'INVESTIGATIVE', label: 'Investigateur' },
        A: { code: 'ARTISTIC', label: 'Artistique' },
        S: { code: 'SOCIAL', label: 'Social' },
        E: { code: 'ENTERPRISING', label: 'Entreprenant' },
        C: { code: 'CONVENTIONAL', label: 'Conventionnel' },
    };
    const leadingLetter = String(phase1Code).charAt(0).toUpperCase();
    const fallbackAxis = axisFromCode[leadingLetter] || axisFromCode.I;
    const primaryAxis = rapportData.primaryAxis || {
        ...fallbackAxis,
        score: 100,
    };

    const definitions = {
        REALISTIC: {
            text: "L'axe Réaliste valorise l'action concrète, la manipulation d'outils, les travaux manuels et techniques. Vous préférez les tâches tangibles, pratiques et bien définies.",
            traits: 'Sens pratique, habileté manuelle, goût pour la technique, autonomie opérationnelle, préférence pour les résultats concrets.',
        },
        INVESTIGATIVE: {
            text: "L'axe Investigateur valorise la curiosité, l'analyse, la résolution de problèmes abstraits. Vous aimez apprendre, observer, expérimenter et comprendre le monde scientifique.",
            traits: 'Rigueur, esprit critique, goût pour la recherche, autonomie intellectuelle, préférence pour les défis complexes.',
        },
        ARTISTIC: {
            text: "L'axe Artistique valorise la créativité, l'expression personnelle et l'innovation. Vous aimez créer, imaginer et vous exprimer à travers différents médiums.",
            traits: 'Créativité, sensibilité, originalité, indépendance, préférence pour les environnements non structurés.',
        },
        SOCIAL: {
            text: "L'axe Social valorise l'aide aux autres, l'éducation et le relationnel. Vous aimez collaborer, enseigner et soutenir les personnes.",
            traits: 'Empathie, patience, sens du service, communication, préférence pour le travail en équipe.',
        },
        ENTERPRISING: {
            text: "L'axe Entreprenant valorise le leadership, la persuasion et la prise de risques. Vous aimez convaincre, diriger et atteindre des objectifs.",
            traits: 'Leadership, persuasion, ambition, énergie, préférence pour les défis commerciaux.',
        },
        CONVENTIONAL: {
            text: "L'axe Conventionnel valorise l'organisation, la précision et le respect des règles. Vous aimez structurer, classer et suivre des procédures.",
            traits: 'Organisation, fiabilité, précision, rigueur, préférence pour les tâches administratives.',
        },
    };

    const def = definitions[primaryAxis.code] || definitions.INVESTIGATIVE;

    return (
        <div className="ori-page">
            <div className="ori-wrapper">
                <div className="ori-header">
                    <div className="ori-header-content">
                        <div className="ori-logo-section">
                            <div>
                                <h1 style={{ marginTop: '7rem' }} className="orientations-header">
                                    Votre Rapport - Phase 1
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div 
                    style={{ 
                        padding: '2rem', 
                        display: 'flex', 
                        flexDirection: 'row', 
                        border: '1px solid #ddd', 
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)', 
                        borderRadius: '10px', 
                        marginBottom: '2rem', 
                        marginTop: '2rem' 
                    }} 
                    className="ria-hero-section"
                >
                    <div className="ria-section-header">
                        <strong style={{ marginRight: '1rem' }} className="ria-section-title">
                            Votre Profil Dominant
                        </strong>
                    </div>

                    <div 
                        style={{ display: 'flex', flexDirection: 'row', marginRight: '1rem' }} 
                        className="ria-hero-card"
                    >
                        <div style={{ marginRight: '1rem' }} className="ria-hero-score">
                            {primaryAxis.label || 'Non déterminé'}
                        </div>
                        <div className="ria-hero-value">
                            {primaryAxis.score || 0}/100
                        </div>
                    </div>
                </div>

                <div className="ria-def-card">
                    <div className="ria-def-title">
                        <IconInfo /> Définition &amp; caractéristiques
                    </div>
                    <p className="ria-def-text">{def.text}</p>
                    <p className="ria-def-traits">
                        <strong>Caractéristiques :</strong> {def.traits}
                    </p>
                </div>

                <div className="ria-interp-card">
                    <div className="ria-interp-title">
                        <IconSearch size={16} /> Interprétation personnalisée
                    </div>
                    <p className="ria-interp-text">
                        Votre score ({primaryAxis.score}/100) indique une forte affinité avec l'axe{' '}
                        {primaryAxis.label}. Vous vous épanouissez dans les environnements qui
                        valorisent
                        {primaryAxis.label === 'Réaliste'
                            ? " l'action concrète et les résultats tangibles"
                            : primaryAxis.label === 'Entreprenant'
                              ? " le leadership et la prise d'initiative"
                              : primaryAxis.label === 'Investigateur'
                                ? " l'analyse et la résolution de problèmes"
                                : primaryAxis.label === 'Artistique'
                                  ? " la créativité et l'expression personnelle"
                                  : primaryAxis.label === 'Social'
                                    ? " l'aide aux autres et la collaboration"
                                    : " l'organisation et la précision"}
                        .
                    </p>
                </div>

                <div className="ria-def-card">
                    <div className="ria-reco-title">
                        <IconGrid /> Formations &amp; métiers recommandés
                    </div>
                    <div className="ria-reco-grid">
                        <div>
                            <div className="ria-reco-col-label">Formations</div>
                            <div className="ria-chip-list">
                                {recommendations.formations.length > 0 ? (
                                    recommendations.formations.map((f, i) => (
                                        <span key={i} className="ria-chip">
                                            {f}
                                        </span>
                                    ))
                                ) : (
                                    <span className="ria-chip">Chargement des formations...</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <div className="ria-reco-col-label">Métiers</div>
                            <div className="ria-chip-list">
                                {recommendations.metiers.length > 0 ? (
                                    recommendations.metiers.map((m, i) => (
                                        <span key={i} className="ria-chip">
                                            {m}
                                        </span>
                                    ))
                                ) : (
                                    <span className="ria-chip">Chargement des métiers...</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <div className="ria-reco-col-label">Écoles</div>
                            <div className="ria-chip-list">
                                {recommendations.ecoles.length > 0 ? (
                                    recommendations.ecoles.map((e, i) => (
                                        <span key={i} className="ria-chip">
                                            {e}
                                        </span>
                                    ))
                                ) : (
                                    <span className="ria-chip">Chargement des écoles...</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="Buttons" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
                    {/* ✅ Bouton pour reprendre le test existant (là où on s'était arrêté) */}
                    <button className="button" onClick={handleResumeTest}>
                        Reprendre le test
                    </button>

                    {/* ✅ Bouton pour recommencer le MÊME test depuis le début */}
                    <button className="button" onClick={handleRestartTest} style={{ background: '#f59e0b', color: 'white' }}>
                        🔄 Recommencer le test
                    </button>

                    {/* ✅ Bouton pour un tout nouveau test (nouvel ID) */}
                    <button className="button" onClick={handleNewTest}>
                        Nouveau test
                    </button>

                    <button className="button" onClick={() => navigate('/universites-formations')}>
                        Voir les écoles
                    </button>  
                </div>
            </div>
        </div>
    );
}

export default RapportPhase1;