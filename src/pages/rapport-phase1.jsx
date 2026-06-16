import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/orientations.css';
import { recommendationService } from '../services/recommendationServe';
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
    const [recommendations, setRecommendations] = useState({
        formations: [],
        metiers: [],
        ecoles: [],
    });

    useEffect(() => {
        const fetchRapport = async () => {
            try {
                const stateResults = location.state?.phaseResults;
                if (stateResults) {
                    setRapportData(stateResults);
                    await fetchRecommendations(stateResults.assessmentId, stateResults.phase1Code);
                    return;
                }

                const storedReport = localStorage.getItem('phase1_report_data');
                if (storedReport) {
                    const parsed = JSON.parse(storedReport);
                    setRapportData(parsed);
                    await fetchRecommendations(parsed.assessmentId, parsed.phase1Code);
                    return;
                }

                const assessmentId =
                    location.state?.assessmentId || localStorage.getItem('assessment_id');
                const sessionToken =
                    location.state?.sessionToken || localStorage.getItem('session_token');

                if (!assessmentId) {
                    setError('Identifiant de test non trouvé');
                    return;
                }

                let response;
                try {
                    response = await api.get(`/results/by-assessment/${assessmentId}`);
                } catch (byAssessmentErr) {
                    response = await api.get('/results/phase1', {
                        params: { assessmentId, sessionToken },
                    });
                }

                const data = response?.data;
                setRapportData(data);
                await fetchRecommendations(assessmentId, data?.phase1Code || data?.code);
            } catch (err) {
                console.error('Erreur lors du chargement du rapport:', err);
                setError(err.message || 'Erreur lors du chargement du rapport');
            } finally {
                setLoading(false);
            }
        };

        const fetchRecommendations = async (assessmentId, phase1Code) => {
            try {
                // ✅ Récupérer UNIQUEMENT la première lettre du code
                const code = phase1Code || rapportData?.phase1Code || rapportData?.code || 'I';
                const leadingLetter = String(code).charAt(0).toUpperCase();

                console.log('Code Phase 1 complet:', code);
                console.log('Lettre dominante (première lettre):', leadingLetter);

                const recoData = await recommendationService.getRiasecRecommendations(
                    assessmentId,
                    leadingLetter,
                );

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
            }
        };

        fetchRapport();
    }, [location.state]);

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
                        <p>Erreur: {error}</p>
                        <button onClick={() => navigate('/tests-orientations')} className="button">
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
                        <button onClick={() => navigate('/tests-orientations')} className="button">
                            Retour
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ✅ Récupérer le code complet Phase 1 (ex: "CRI")
    const fullCode = rapportData?.phase1Code || rapportData?.code || 'I';
    
    // ✅ Extraire UNIQUEMENT la première lettre (ex: "C")
    const leadingLetter = String(fullCode).charAt(0).toUpperCase();
    
    // ✅ Déterminer l'axe à partir de la première lettre
    const axisFromCode = {
        R: { code: 'REALISTIC', label: 'Réaliste', color: '#ef4444', icon: '🔧', bg: '#fef2f2' },
        I: { code: 'INVESTIGATIVE', label: 'Investigateur', color: '#3b82f6', icon: '🔬', bg: '#eff6ff' },
        A: { code: 'ARTISTIC', label: 'Artistique', color: '#ec4899', icon: '🎨', bg: '#fdf2f8' },
        S: { code: 'SOCIAL', label: 'Social', color: '#10b981', icon: '👥', bg: '#ecfdf5' },
        E: { code: 'ENTERPRISING', label: 'Entreprenant', color: '#f59e0b', icon: '💼', bg: '#fffbeb' },
        C: { code: 'CONVENTIONAL', label: 'Conventionnel', color: '#8b5cf6', icon: '📋', bg: '#f5f3ff' },
    };
    
    const primaryAxis = axisFromCode[leadingLetter] || axisFromCode.I;
    
    // ✅ Code affiché = UNIQUEMENT la première lettre
    const displayCode = leadingLetter;

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

                {/* ✅ Affichage de la 1ère lettre UNIQUEMENT */}
                <div style={{ 
                    padding: '2rem',
                    display: 'flex', 
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: `3px solid ${primaryAxis.color}`,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    borderRadius: '16px',
                    marginBottom: '2rem',
                    marginTop: '2rem',
                    background: primaryAxis.bg || `${primaryAxis.color}10`,
                    flexWrap: 'wrap',
                    gap: '1rem',
                }} className="ria-hero-section">
                    <div className="ria-section-header">
                        <strong style={{ marginRight: '1rem', fontSize: '1.1rem' }} className="ria-section-title">
                            Votre Profil Dominant
                        </strong>
                    </div>

                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '1.5rem',
                        flexWrap: 'wrap',
                    }} className="ria-hero-card">
                        {/* ✅ UNIQUEMENT la première lettre en grand */}
                        <div style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.5rem',
                        }}>
                            <span style={{ 
                                fontSize: '4.5rem',
                                fontWeight: 'bold',
                                color: primaryAxis.color,
                                background: `${primaryAxis.color}20`,
                                padding: '0.5rem 1.5rem',
                                borderRadius: '16px',
                                border: `3px solid ${primaryAxis.color}`,
                                minWidth: '80px',
                                textAlign: 'center',
                                lineHeight: '1.2',
                            }}>
                                {displayCode}
                            </span>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                                    {primaryAxis.icon} {primaryAxis.label}
                                </div>
                                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                                    Code complet : <strong>{fullCode}</strong>
                                </div>
                            </div>
                        </div>
                        
                        <div style={{ 
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            color: primaryAxis.color,
                            background: `${primaryAxis.color}20`,
                            padding: '0.5rem 1.2rem',
                            borderRadius: '8px',
                        }}>
                            {Math.round(rapportData?.primaryAxis?.score || rapportData?.score || 85)}/100
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
                        Votre profil dominant est <strong style={{ color: primaryAxis.color }}>
                            {primaryAxis.label} ({displayCode})
                        </strong>. 
                        Vous vous épanouissez dans les environnements qui valorisent
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
                    <p style={{ marginTop: '0.5rem', color: '#6b7280', fontSize: '0.95rem' }}>
                        <strong>Conseil :</strong> Explorez les métiers et formations 
                        recommandés ci-dessous pour approfondir votre orientation.
                    </p>
                </div>

                <div className="ria-def-card">
                    <div className="ria-reco-title">
                        <IconGrid /> Formations &amp; métiers recommandés
                    </div>
                    <div className="ria-reco-grid">
                        <div>
                            <div className="ria-reco-col-label">📚 Formations</div>
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
                            <div className="ria-reco-col-label">💼 Métiers</div>
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
                            <div className="ria-reco-col-label">🏛️ Écoles</div>
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

                <div className="Buttons" style={{ 
                    display: 'flex', 
                    gap: '1rem', 
                    marginTop: '2rem',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                }}>
                    <button 
                        className="button" 
                        onClick={() => navigate('/tests-orientations')}
                        style={{
                            padding: '0.75rem 2rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#3b82f6',
                            color: 'white',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#2563eb'}
                        onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
                    >
                        Nouveau test
                    </button>

                    <button 
                        className="button" 
                        onClick={() => navigate('/universites-formations')}
                        style={{
                            padding: '0.75rem 2rem',
                            borderRadius: '8px',
                            border: '2px solid #3b82f6',
                            background: 'transparent',
                            color: '#3b82f6',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#3b82f6';
                            e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = '#3b82f6';
                        }}
                    >
                        Voir les écoles
                    </button>

                    <button 
                        className="button" 
                        onClick={() => navigate('/espace-personnel')}
                        style={{
                            padding: '0.75rem 2rem',
                            borderRadius: '8px',
                            border: '2px solid #10b981',
                            background: 'transparent',
                            color: '#10b981',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#10b981';
                            e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = '#10b981';
                        }}
                    >
                        Mon espace
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RapportPhase1;