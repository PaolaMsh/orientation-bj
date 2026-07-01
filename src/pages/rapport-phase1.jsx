import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/orientations.css';
import { recommendationService } from '../services/recommendationService';
import api from '../services/api';

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

            const recoData = await recommendationService.getRiasecRecommendations(id, leadingLetter);
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
                const assessmentIdFromState = location.state?.assessmentId || localStorage.getItem('assessment_id');
                const sessionToken = location.state?.sessionToken || localStorage.getItem('session_token');

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
                <h1 style={{ marginTop: '2rem', marginBottom: '2rem' }}>Votre Rapport - Phase 1</h1>

                {/* Profil dominant */}
                <div style={{
                    padding: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid #ddd',
                    borderRadius: '10px',
                    marginBottom: '2rem'
                }}>
                    <strong>Votre Profil Dominant</strong>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold' }}>{primaryAxis.label || 'Non déterminé'}</span>
                        <span style={{ color: '#0d9488', fontWeight: 'bold' }}>{primaryAxis.score || 0}/100</span>
                    </div>
                </div>

                {/* Définition */}
                <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '10px', marginBottom: '2rem' }}>
                    <h3>Définition & caractéristiques</h3>
                    <p>{def.text}</p>
                    <p><strong>Caractéristiques :</strong> {def.traits}</p>
                </div>

                {/* Interprétation */}
                <div style={{
                    padding: '1.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '10px',
                    marginBottom: '2rem',
                    backgroundColor: '#f9fafb'
                }}>
                    <h3>Interprétation personnalisée</h3>
                    <p>
                        Votre score ({primaryAxis.score}/100) indique une forte affinité avec l'axe {primaryAxis.label}.
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
                                            : " l'organisation et la précision"}.
                    </p>
                </div>

                {/* Recommandations */}
                <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '10px', marginBottom: '2rem' }}>
                    <h3>Formations & métiers recommandés</h3>

                    <div>
                        <h4>Formations</h4>
                        <ul>
                            {recommendations.formations.length > 0 ? (
                                recommendations.formations.map((f, i) => <li key={i}>{f}</li>)
                            ) : (
                                <li>Chargement des formations...</li>
                            )}
                        </ul>
                    </div>

                    <div>
                        <h4>Métiers</h4>
                        <ul>
                            {recommendations.metiers.length > 0 ? (
                                recommendations.metiers.map((m, i) => <li key={i}>{m}</li>)
                            ) : (
                                <li>Chargement des métiers...</li>
                            )}
                        </ul>
                    </div>

                    <div>
                        <h4>Écoles</h4>
                        <ul>
                            {recommendations.ecoles.length > 0 ? (
                                recommendations.ecoles.map((e, i) => <li key={i}>{e}</li>)
                            ) : (
                                <li>Chargement des écoles...</li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Boutons - navigation simple */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
                    <button className="button" onClick={() => navigate('/phaseText')}>
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