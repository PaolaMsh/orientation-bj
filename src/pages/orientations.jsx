import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import '../styles/orientations.css';
import { recommendationService } from '../services/recommendationService';
import { saveTestResult, savePdfReport } from '../services/testService';

const IconDoc = () => (
    <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

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

const IconBar = () => (
    <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
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

const IconWrench = ({ size = 16 }) => (
    <svg
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
);

const IconUsers = ({ size = 16 }) => (
    <svg
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
);

const IconCalendar = ({ size = 16 }) => (
    <svg
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const IconClipboard = ({ size = 16 }) => (
    <svg
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <rect x="9" y="2" width="6" height="4" rx="1" />
        <path d="M9 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2h-2" />
        <line x1="9" y1="12" x2="15" y2="12" />
        <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
);

const IconHome = ({ size = 20 }) => (
    <svg
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
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

const IconTrend = ({ size = 13 }) => (
    <svg
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
    </svg>
);

const IconBarChart = ({ size = 20 }) => (
    <svg width={size} height={size} fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const IconPrinter = ({ size = 20 }) => (
    <svg
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path d="M6 9V3h12v6" />
        <path d="M6 21H4a2 2 0 01-2-2v-6a2 2 0 012-2h16a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
        <path d="M18 15v6H6v-6" />
        <rect x="8" y="11" width="8" height="2" />
    </svg>
);

function GenericTab({ axisKey, axisLabel, score, recommendations }) {
    const reco = recommendations?.[axisKey] || {
        formations: ['Aucune formation disponible'],
        metiers: ['Aucun métier disponible'],
        ecoles: ['Aucune école disponible'],
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

    const def = definitions[axisKey] || definitions.INVESTIGATIVE;

    return (
        <>
            <div className="ria-def-card">
                <div className="ria-def-title">
                    <IconInfo /> Définition & caractéristiques
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
                    Votre score ({score}/100) indique une forte affinité avec l'axe {axisLabel}.
                    Vous vous épanouissez dans les environnements qui valorisent{' '}
                    {axisLabel === 'Réaliste'
                        ? "l'action concrète et les résultats tangibles"
                        : axisLabel === 'Entreprenant'
                          ? "le leadership et la prise d'initiative"
                          : axisLabel === 'Investigateur'
                            ? "l'analyse et la résolution de problèmes"
                            : axisLabel === 'Artistique'
                              ? "la créativité et l'expression personnelle"
                              : axisLabel === 'Social'
                                ? "l'aide aux autres et la collaboration"
                                : "l'organisation et la précision"}
                    .
                </p>
            </div>

            <div className="ria-def-card">
                <div className="ria-reco-title">
                    <IconGrid /> Formations & métiers recommandés
                </div>
                <div className="ria-reco-grid">
                    <div>
                        <div className="ria-reco-col-label">Formations</div>
                        <div className="ria-chip-list">
                            {reco.formations?.length > 0 ? (
                                reco.formations.map((f, i) => (
                                    <span key={i} className="ria-chip">
                                        {f}
                                    </span>
                                ))
                            ) : (
                                <span className="ria-chip">Aucune formation disponible</span>
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="ria-reco-col-label">Métiers</div>
                        <div className="ria-chip-list">
                            {reco.metiers?.length > 0 ? (
                                reco.metiers.map((m, i) => (
                                    <span key={i} className="ria-chip">
                                        {m}
                                    </span>
                                ))
                            ) : (
                                <span className="ria-chip">Aucun métier disponible</span>
                            )}
                        </div>
                    </div>
                </div>

                {reco.ecoles?.length > 0 ? (
                    <>
                        <div className="ria-ecoles-title">
                            <IconHome size={18} /> Écoles / Centres de formation
                        </div>
                        <div>
                            {reco.ecoles?.map((e, i) => (
                                <div className="ria-ecole-item" key={i}>
                                    <span className="ria-ecole-dot" />
                                    {e}
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="ria-ecoles-title">
                            <IconHome size={18} /> Écoles / Centres de formation
                        </div>
                        <div className="ria-ecole-item">
                            <span className="ria-ecole-dot" />
                            Aucune école disponible
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

const MOCK_SCORES = {
    REALISTIC: 78,
    INVESTIGATIVE: 92,
    ARTISTIC: 35,
    SOCIAL: 40,
    ENTERPRISING: 70,
    CONVENTIONAL: 45,
};

const API_BASE_URL = 'https://api-orientation-production.up.railway.app/api/v1';

function RadarChart({ scores }) {
    const cx = 200,
        cy = 175,
        maxR = 130;
    const axes = [
        { label: 'Realiste (R)', angle: -90, value: scores?.REALISTIC || 0 },
        { label: 'Investigateur (I)', angle: -30, value: scores?.INVESTIGATIVE || 0 },
        { label: 'Artistique (A)', angle: 30, value: scores?.ARTISTIC || 0 },
        { label: 'Social (S)', angle: 90, value: scores?.SOCIAL || 0 },
        { label: 'Entreprenant (E)', angle: 150, value: scores?.ENTERPRISING || 0 },
        { label: 'Conventionnel (C)', angle: 210, value: scores?.CONVENTIONAL || 0 },
    ];

    const toRad = (d) => (d * Math.PI) / 180;
    const polar = (angle, r) => ({
        x: cx + r * Math.cos(toRad(angle)),
        y: cy + r * Math.sin(toRad(angle)),
    });
    const pts = (arr) => arr.map((p) => `${p.x},${p.y}`).join(' ');

    const levels = [20, 40, 60, 80, 100];

    const gridPolygons = levels.map((lvl) => {
        const points = pts(axes.map((a) => polar(a.angle, (lvl / 100) * maxR)));
        return <polygon key={lvl} points={points} fill="none" stroke="#e5e7eb" strokeWidth="1" />;
    });

    const scaleLabels = levels.map((lvl) => {
        const p = polar(-90, (lvl / 100) * maxR);
        return (
            <text
                key={lvl}
                x={p.x + 4}
                y={p.y + 4}
                fontSize="10"
                fill="#9ca3af"
                fontFamily="Inter,sans-serif"
            >
                {lvl}
            </text>
        );
    });

    const axisLines = axes.map((a, i) => {
        const end = polar(a.angle, maxR);
        return (
            <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="#d1d5db" strokeWidth="1" />
        );
    });

    const axisLabels = axes.map((a, i) => {
        const p = polar(a.angle, maxR + 22);
        return (
            <text
                key={i}
                x={p.x}
                y={p.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fill="#6b7280"
                fontFamily="Inter,sans-serif"
            >
                {a.label}
            </text>
        );
    });

    const dataPoints = pts(axes.map((a) => polar(a.angle, (a.value / 100) * maxR)));
    const dots = axes.map((a, i) => {
        const p = polar(a.angle, (a.value / 100) * maxR);
        return (
            <circle key={i} cx={p.x} cy={p.y} r="5" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
        );
    });

    return (
        <div className="ria-radar-wrap">
            <svg width="400" height="360" viewBox="0 0 400 360" style={{ overflow: 'visible' }}>
                <g>{gridPolygons}</g>
                <g>{scaleLabels}</g>
                <g>{axisLines}</g>
                <polygon
                    points={dataPoints}
                    fill="rgba(13,148,136,0.18)"
                    stroke="#0d9488"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                />
                <g>{axisLabels}</g>
                <g>{dots}</g>
            </svg>
            <div className="ria-radar-legend">
                <div className="ria-radar-legend-line" />
                <span>Votre profil</span>
            </div>
        </div>
    );
}

export default function Orientations() {
    const navigate = useNavigate();
    const { assessmentId } = useParams();
    const [activeTab, setActiveTab] = useState('investigative');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [data, setData] = useState({
        scores: null,
        recommendationsByAxis: null,
        careers: [],
        formations: [],
        assessmentInfo: null,
        behavioral: null,
    });

    const handleSaveReport = () => {
        setSaving(true);

        const scores = data.scores || MOCK_SCORES;
        const riasecCode =
            data.assessmentInfo?.code ||
            Object.entries(scores)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([key]) => key[0])
                .join('');

        const behavioralData = data.behavioral || {
            pointsForts: [
                {
                    title: 'Curiosité intellectuelle',
                    description:
                        'Vous aimez résoudre des problèmes complexes et apprendre par vous-même.',
                },
                {
                    title: 'Pragmatisme',
                    description: "Capacité à passer à l'action et à manipuler des outils concrets.",
                },
            ],
            axesAmelioration: [
                {
                    title: 'Travail collaboratif',
                    description: 'Développer la collaboration en équipe.',
                },
            ],
        };

        const testResult = {
            title: "Test RIASEC - Rapport d'orientation",
            score: Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 6),
            type: 'RIASEC',
            code: riasecCode,
            fullReport: {
                scores: scores,
                code: riasecCode,
                recommendations: data.recommendationsByAxis,
                completedAt: new Date().toISOString(),
                assessmentId: assessmentId || localStorage.getItem('assessment_id'),
                behavioral: behavioralData,
                assessmentInfo: data.assessmentInfo,
            },
        };

        const savedTest = saveTestResult(testResult);
        console.log('✅ Test sauvegardé:', savedTest);

        const report = {
            title: `Rapport RIASEC - ${new Date().toLocaleDateString()}`,
            type: 'RIASEC',
            testId: savedTest.id,
            content: {
                scores: scores,
                code: riasecCode,
                recommendations: data.recommendationsByAxis,
                behavioral: behavioralData,
                assessmentInfo: data.assessmentInfo,
            },
        };

        savePdfReport(report);
        console.log('✅ Rapport sauvegardé');

        setSaving(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const fetchCompleteReport = async (id) => {
        setLoading(true);

        try {
            console.log('🔍 Fetching results for assessment:', id);

            const token = localStorage.getItem('token');
            if (!token) {
                console.error('❌ Token manquant');
                setError("Token d'authentification manquant");
                setLoading(false);
                return;
            }

            const response = await fetch(`${API_BASE_URL}/results/by-assessment/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const resultData = await response.json();
            console.log('📊 Données reçues:', resultData);

            let recommendationsData = {
                recommendationsByAxis: {},
                careers: [],
                formations: [],
            };
            try {
                recommendationsData = await recommendationService.getRiasecRecommendations(id);
                console.log('✅ Recommandations API séparées et formatées:', recommendationsData);
            } catch (recoError) {
                console.error('❌ Erreur API recommandations:', recoError);
            }

            const phase2Scores = resultData.phase2Scores || {};
            const convertScore = (value) => {
                const numValue = Number(value) || 0;
                let calculated = Math.round((numValue / 20) * 100);
                return Math.min(calculated, 100);
            };
            const scores = {
                REALISTIC: convertScore(phase2Scores.R || 0),
                INVESTIGATIVE: convertScore(phase2Scores.I || 0),
                ARTISTIC: convertScore(phase2Scores.A || 0),
                SOCIAL: convertScore(phase2Scores.S || 0),
                ENTERPRISING: convertScore(phase2Scores.E || 0),
                CONVENTIONAL: convertScore(phase2Scores.C || 0),
            };

            console.log('🎯 Scores convertis:', scores);

            const axisNames = {
                I: 'Investigateur',
                R: 'Réaliste',
                A: 'Artistique',
                S: 'Social',
                E: 'Entreprenant',
                C: 'Conventionnel',
            };

            const pointsForts = (resultData.strengths || []).map((s) => ({
                title: axisNames[s] || s,
                description: `Vous avez un fort potentiel dans l'axe ${axisNames[s] || s}.`,
            }));

            const axesAmelioration = (resultData.weaknesses || []).map((w) => ({
                title: axisNames[w] || w,
                description: `L'axe ${axisNames[w] || w} est à développer.`,
            }));

            const riasecCode =
                resultData.phase2Code ||
                Object.entries(scores)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3)
                    .map(([key]) => key[0])
                    .join('');

            const topScoreValue = Math.max(...Object.values(scores));
            let coherenceLevel = 'Faible';
            if (topScoreValue >= 80) {
                coherenceLevel = 'Élevée';
            } else if (topScoreValue >= 50) {
                coherenceLevel = 'Moyenne';
            } else {
                coherenceLevel = 'Faible';
            }

            setData({
                scores: scores,
                recommendationsByAxis: recommendationsData?.recommendationsByAxis || {},
                careers: recommendationsData?.careers || [],
                formations: recommendationsData?.formations || [],
                assessmentInfo: {
                    status: 'COMPLETED',
                    completedAt: resultData.createdAt || new Date().toISOString(),
                    coherence: coherenceLevel,
                    code: riasecCode,
                },
                behavioral: {
                    pointsForts: pointsForts,
                    axesAmelioration: axesAmelioration,
                },
            });

            setError(null);
        } catch (err) {
            console.error('❌ Erreur fetchCompleteReport:', err);
            setError(err.message || 'Erreur lors du chargement des résultats');
            setData({
                scores: null,
                recommendationsByAxis: null,
                careers: [],
                formations: [],
                assessmentInfo: null,
                behavioral: null,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            console.log('🔍 AssessmentId from URL/Params:', assessmentId);

            if (assessmentId) {
                await fetchCompleteReport(assessmentId);
            } else {
                const storedAssessmentId = localStorage.getItem('assessment_id');
                console.log('📦 AssessmentId from localStorage:', storedAssessmentId);

                if (storedAssessmentId) {
                    await fetchCompleteReport(storedAssessmentId);
                } else {
                    console.warn('⚠️ Aucun assessmentId trouvé, utilisation des données mockées');
                    setData({
                        scores: MOCK_SCORES,
                        assessmentInfo: {
                            status: 'COMPLETED',
                            completedAt: new Date().toISOString(),
                            coherence: 'Élevée',
                        },
                        behavioral: null,
                    });
                    setLoading(false);
                }
            }
        };

        loadData();
    }, [assessmentId]);

    const getDominantScores = () => {
        const scores = data.scores || MOCK_SCORES;
        if (!scores) return [];
        const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        return sorted.slice(0, 3);
    };

    const getTopAxes = () => {
        const scores = data.scores || MOCK_SCORES;
        if (!scores) return [];
        const axes = [
            { key: 'REALISTIC', label: 'Réaliste', score: scores.REALISTIC, icon: '🔧' },
            {
                key: 'INVESTIGATIVE',
                label: 'Investigateur',
                score: scores.INVESTIGATIVE,
                icon: '🔬',
            },
            { key: 'ARTISTIC', label: 'Artistique', score: scores.ARTISTIC, icon: '🎨' },
            { key: 'SOCIAL', label: 'Social', score: scores.SOCIAL, icon: '👥' },
            { key: 'ENTERPRISING', label: 'Entreprenant', score: scores.ENTERPRISING, icon: '💼' },
            { key: 'CONVENTIONAL', label: 'Conventionnel', score: scores.CONVENTIONAL, icon: '📋' },
        ];
        return axes.sort((a, b) => b.score - a.score).slice(0, 2);
    };

    const dominantScores = getDominantScores();
    const topAxes = getTopAxes();
    const topScoreValue = Math.min(dominantScores[0]?.[1] || 0, 100);
    const code = dominantScores.map(([key]) => key[0]).join('');
    // Ajouter dans Orientations.jsx la fonction pour générer la treasure map

    const generateTreasureMap = async () => {
        const assessmentIdToUse = assessmentId || localStorage.getItem('assessment_id');
        const sessionToken = localStorage.getItem('session_token');

        if (!sessionToken) {
            console.warn('No session token found');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/treasure-map', {
                sessionToken,
                assessmentId: assessmentIdToUse,
                generatePdf: false,
            });

            if (response.data?.shareToken) {
                // Afficher un lien pour partager
                const shareUrl = `${window.location.origin}/share/${response.data.shareToken}`;
                console.log('Treasure map shareable:', shareUrl);
                alert(`Carte générée ! Partagez-la : ${shareUrl}`);
            }
        } catch (error) {
            console.error('Error generating treasure map:', error);
        } finally {
            setLoading(false);
        }
    };

    // Ajouter un bouton dans le rendu
    <button className="button" onClick={generateTreasureMap}>
        Générer ma carte 🗺️
    </button>;

    useEffect(() => {
        if (topAxes.length > 0 && activeTab === 'investigative') {
            setActiveTab(topAxes[0].key);
        }
    }, [topAxes, activeTab]);

    const behavioralData = data.behavioral || {
        pointsForts: [
            {
                title: 'Curiosité intellectuelle',
                description:
                    'Vous aimez résoudre des problèmes complexes et apprendre par vous-même.',
            },
            {
                title: 'Pragmatisme',
                description: "Capacité à passer à l'action et à manipuler des outils concrets.",
            },
        ],
        axesAmelioration: [
            {
                title: 'Travail collaboratif',
                description: 'Développer la collaboration en équipe.',
            },
        ],
    };

    if (loading) {
        return (
            <div className="ria-body">
                <div className="ria-container">
                    <div
                        className="loading-spinner"
                        style={{ textAlign: 'center', padding: '50px' }}
                    >
                        <div className="spinner"></div>
                        <p>Chargement de vos résultats...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="ria-body">
                <div className="ria-container">
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <p style={{ color: 'red', marginBottom: '20px' }}>Erreur : {error}</p>
                        <button
                            onClick={() => navigate('/tests')}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#0d9488',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                            }}
                        >
                            Faire un autre test
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const { scores, recommendationsByAxis, assessmentInfo } = data;
    const finalScores = scores || MOCK_SCORES;

    return (
        <div className="ria-body">
            <div className="ria-container">
                {saveSuccess && (
                    <div className="save-success-message">
                        ✅ Rapport enregistré avec succès dans votre espace personnel !
                    </div>
                )}

                <div className="ria-page-header">
                    <div className="ria-page-header-icon">
                        <IconBarChart />
                    </div>
                    <h1>Explorateur de carrieres — Axes RIASEC</h1>
                    <span className="ria-dominant-badge">dominants détectés</span>
                </div>

                <div className="ria-card ria-header-card">
                    <div className="orientations-header">
                        <h1> Mon rapport d'orientation RIASEC</h1>
                        <p className="report-date">
                            Test effectué le{' '}
                            {assessmentInfo?.completedAt
                                ? new Date(assessmentInfo.completedAt).toLocaleDateString('fr-FR', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric',
                                  })
                                : new Date().toLocaleDateString('fr-FR', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric',
                                  })}
                        </p>
                        <div className="report-badge">
                            <span className="badge-code">
                                Code RIASEC: <strong>{assessmentInfo?.code || code}</strong>
                            </span>
                            <span className="badge-status">
                                Statut:{' '}
                                {assessmentInfo?.status === 'COMPLETED'
                                    ? '✅ Terminé'
                                    : assessmentInfo?.status === 'IN_PROGRESS'
                                      ? '🔄 En cours'
                                      : '⏸️ Abandonné'}
                            </span>
                            <span className="star-icon">&#9733;</span>
                            Score global de compatibilite : <strong>{topScoreValue}%</strong>
                        </div>
                    </div>
                </div>

                <section className="ria-section">
                    <div className="ria-section-label">
                        <span className="ria-section-label-icon">
                            <IconInfo />
                        </span>
                        <h2>1. Resume du test</h2>
                    </div>
                    <div className="ria-card">
                        <div className="ria-card-subtitle">
                            <IconClipboard /> Synthese de l'evaluation
                        </div>
                        <p className="ria-summary-text">
                            Test d'interets professionnels et de personnalite base sur la typologie
                            de Holland (RIASEC). Objectif : identifier vos affinites naturelles pour
                            guider vos choix de formation et metier.
                        </p>
                        <ul className="ria-stats-list">
                            <li>
                                <strong>Statut :</strong> {assessmentInfo?.status || 'COMPLETED'}
                            </li>
                            <li>
                                <strong>Coherence des reponses :</strong>{' '}
                                {assessmentInfo?.coherence || 'Élevée'}
                            </li>
                            <li>
                                <strong>Axes dominants detectes :</strong>{' '}
                                {dominantScores
                                    .map(([key, val]) => {
                                        const name =
                                            key === 'INVESTIGATIVE'
                                                ? 'Investigateur'
                                                : key === 'REALISTIC'
                                                  ? 'Realiste'
                                                  : key === 'ENTERPRISING'
                                                    ? 'Entreprenant'
                                                    : key === 'SOCIAL'
                                                      ? 'Social'
                                                      : key === 'ARTISTIC'
                                                        ? 'Artistique'
                                                        : 'Conventionnel';
                                        return `${name}: ${val}/100`;
                                    })
                                    .join(' & ')}
                            </li>
                        </ul>
                    </div>
                </section>

                <section className="ria-section">
                    <div className="ria-section-label">
                        <span className="ria-section-label-icon">
                            <IconBar />
                        </span>
                        <h2>2. Detail &amp; observations</h2>
                    </div>
                    <div className="ria-card">
                        <div className="ria-group-title teal">
                            <span className="dot" /> Points forts identifies
                        </div>
                        {behavioralData.pointsForts?.map((point, index) => (
                            <div className="ria-obs-item" key={index}>
                                <div className="ria-obs-icon-box teal">
                                    {index === 0 ? (
                                        <IconSearch size={16} />
                                    ) : (
                                        <IconWrench size={16} />
                                    )}
                                </div>
                                <div>
                                    <strong>{point.title} :</strong> {point.description}
                                </div>
                            </div>
                        ))}

                        <div className="ria-group-title amber">
                            <span className="dot" /> Axes d'amelioration
                        </div>
                        {behavioralData.axesAmelioration?.length > 0 ? (
                            behavioralData.axesAmelioration.map((axe, index) => (
                                <div className="ria-obs-item" key={index}>
                                    <div className="ria-obs-icon-box amber">
                                        <IconUsers />
                                    </div>
                                    <div>
                                        <strong>{axe.title} :</strong> {axe.description}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="ria-obs-item">
                                <div className="ria-obs-icon-box amber">
                                    <IconUsers />
                                </div>
                                <div>
                                    <strong>À développer :</strong> Tous vos axes sont équilibrés,
                                    continuez à explorer différents domaines.
                                </div>
                            </div>
                        )}
                        <div className="ria-behavioral-note">
                            <IconInfo />
                            <span>Analyse basee sur vos reponses au questionnaire RIASEC.</span>
                        </div>
                    </div>
                </section>

                <section className="ria-section">
                    <div className="ria-section-label">
                        <span className="ria-section-label-icon">
                            <IconHome />
                        </span>
                        <h2>3. Profil utilisateur — Hexagramme RIASEC</h2>
                    </div>
                    <div className="ria-card">
                        <RadarChart scores={finalScores} />
                        <div className="ria-dominantes-title">Votre carte des dominantes</div>
                        <div className="ria-dominante-tags">
                            {dominantScores.map(([key, val], idx) => {
                                let colorClass = idx === 0 ? 'teal' : idx === 1 ? 'gray' : 'amber';
                                let icon = <IconSearch size={13} />;
                                let label =
                                    key === 'REALISTIC'
                                        ? 'Realiste'
                                        : key === 'ENTERPRISING'
                                          ? 'Entreprenant'
                                          : key === 'INVESTIGATIVE'
                                            ? 'Investigateur'
                                            : key === 'SOCIAL'
                                              ? 'Social'
                                              : key === 'ARTISTIC'
                                                ? 'Artistique'
                                                : 'Conventionnel';
                                if (key === 'REALISTIC') icon = <IconWrench size={13} />;
                                if (key === 'ENTERPRISING') icon = <IconTrend />;
                                return (
                                    <span key={key} className={`ria-dominante-tag ${colorClass}`}>
                                        {icon} {label} ({val})
                                    </span>
                                );
                            })}
                        </div>
                        <p className="ria-profile-desc">
                            Votre profil met en evidence une forte appetence pour la{' '}
                            <strong>recherche, l'analyse</strong> et les activites
                            <strong> pratiques/manuelles</strong>. Les metiers d'ingenierie, de
                            R&amp;D ou de conception technique correspondent naturellement a vos
                            aspirations.
                        </p>
                    </div>
                </section>

                <section className="ria-section">
                    <div className="ria-explorer-header">
                        <span className="ria-explorer-header-icon">
                            <IconSearch />
                        </span>
                        <h2>Explorateur de carrières — Vos axes dominants</h2>
                    </div>

                    <div className="ria-tabs">
                        {topAxes.map((axis) => (
                            <button
                                key={axis.key}
                                className={`ria-tab${activeTab === axis.key ? ' active' : ''}`}
                                onClick={() => setActiveTab(axis.key)}
                            >
                                {axis.icon} {axis.label} ({axis.score})
                            </button>
                        ))}
                    </div>

                    {topAxes.map(
                        (axis) =>
                            activeTab === axis.key && (
                                <GenericTab
                                    key={axis.key}
                                    axisKey={axis.key}
                                    axisLabel={axis.label}
                                    score={axis.score}
                                    recommendations={recommendationsByAxis || {}}
                                />
                            ),
                    )}
                </section>

                <div className="Buttons">
                    <button className="button" onClick={() => navigate('/tests')}>
                        Nouveau test
                    </button>
                    <button className="button" onClick={handleSaveReport} disabled={saving}>
                        {saving ? 'Enregistrement...' : 'Enregistrer le rapport'}
                    </button>
                    <button className="button" onClick={() => navigate('/universites-formations')}>
                        Voir les écoles
                    </button>
                </div>
            </div>
        </div>
    );
}
