import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import '../styles/parcours.css';
import api from '../services/api';

const IconUser = () => (
    <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const IconHistory = () => (
    <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const IconFile = () => (
    <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
);

const IconTrendUp = () => (
    <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
    </svg>
);

const IconDashboard = () => (
    <svg
        width="20"
        height="20"
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

const IconDownload = () => (
    <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

const IconEye = () => (
    <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const IconCalendar = () => (
    <svg
        width="14"
        height="14"
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

const IconScholarship = () => (
    <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
);

const IconEdit = () => (
    <svg
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path d="M17 3l4 4L7 21H3v-4L17 3z" />
    </svg>
);

const IconCheck = () => (
    <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const IconChart = () => (
    <svg
        width="16"
        height="16"
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

const IconTrophy = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M4 17L12 22L20 17M4 12L12 17L20 12M12 2L4 7L12 12L20 7L12 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
    </svg>
);

const IconLoader = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <circle cx="12" cy="12" r="10" opacity="0.2" />
        <path d="M22 12a10 10 0 0 0-10-10" />
    </svg>
);

const IconBookmark = () => (
    <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
);

const MENU_ITEMS = [
    { id: 'dashboard', label: 'Tableau de bord', icon: <IconDashboard /> },
    { id: 'tests', label: 'Mes tests', icon: <IconHistory /> },
    { id: 'reports', label: 'Rapports', icon: <IconFile /> },
    { id: 'bourses', label: 'Bourses', icon: <IconTrophy /> },
    { id: 'profile', label: 'Profil', icon: <IconUser /> },
];

const MONTHS = [
    'Jan',
    'Fév',
    'Mar',
    'Avr',
    'Mai',
    'Juin',
    'Juil',
    'Aoû',
    'Sep',
    'Oct',
    'Nov',
    'Déc',
];

const AXIS_LABELS = {
    REALISTIC: 'Réaliste',
    INVESTIGATIVE: 'Investigateur',
    ARTISTIC: 'Artistique',
    SOCIAL: 'Social',
    ENTERPRISING: 'Entreprenant',
    CONVENTIONAL: 'Conventionnel',
};

const STATUS_LABELS = {
    completed: 'Terminé',
    in_progress: 'En cours',
    not_started: 'Non commencé',
    abandoned: 'Abandonné',
    unknown: 'Inconnu',
};

function formatDate(value) {
    if (!value) return 'Date inconnue';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Date inconnue';
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

// ✅ Fonction pour extraire la lettre dominante d'un code Phase 1
function getDominantLetter(code) {
    if (!code) return '';
    const codeStr = String(code);
    // Si c'est un code Phase 1 (ex: "CRI"), on prend la première lettre
    // Si c'est un code Phase 2 (ex: "CRI"), on garde les 3 lettres
    return codeStr.charAt(0).toUpperCase();
}

// ✅ Fonction pour formater l'affichage du code selon le type
function formatDisplayCode(assessment) {
    const code = assessment?.phase2Code || assessment?.phase1Code || assessment?.code || '';
    if (!code) return '';
    
    // Si c'est une Phase 1, on affiche seulement la première lettre
    if (assessment?.type === 'PHASE1') {
        return code.charAt(0).toUpperCase();
    }
    
    // Sinon (Phase 2 / FULL), on affiche le code complet
    return code;
}

// Fonction pour vérifier si le test a vraiment été commencé
function checkIfAssessmentStarted(assessment) {
    // Vérifier s'il y a des réponses
    if (assessment.responses && assessment.responses.length > 0) {
        return true;
    }

    // Vérifier les batches de réponses
    if (assessment.responseBatches && assessment.responseBatches.length > 0) {
        return true;
    }

    // Vérifier le nombre de questions répondues
    if (assessment.answeredQuestions && assessment.answeredQuestions > 0) {
        return true;
    }

    // Vérifier le pourcentage de complétion
    if (assessment.completionPercentage && assessment.completionPercentage > 0) {
        return true;
    }

    // Vérifier les réponses dans les données brutes
    if (assessment.raw) {
        const raw = assessment.raw;
        if (raw.responses && raw.responses.length > 0) return true;
        if (raw.responseBatches && raw.responseBatches.length > 0) return true;
        if (raw.answeredQuestions && raw.answeredQuestions > 0) return true;
        if (raw.completionPercentage && raw.completionPercentage > 0) return true;
    }

    return false;
}

function normalizeStatus(status, assessment) {
    const normalized = String(status || '').toLowerCase();

    // Si le statut est explicitement 'completed'
    if (normalized === 'completed') return 'completed';

    // Si le statut est 'in_progress', vérifier si des réponses existent
    if (normalized === 'in_progress') {
        const hasStarted = checkIfAssessmentStarted(assessment);
        return hasStarted ? 'in_progress' : 'not_started';
    }

    if (normalized === 'abandoned') return 'abandoned';

    return 'unknown';
}

function buildAssessmentTitle(assessment) {
    const type = String(assessment?.type || 'RIASEC').toUpperCase();
    if (type === 'FULL') return 'Test complet';
    if (type === 'PHASE1') return 'Test Phase 1';
    return `Test ${type}`;
}

function buildAssessmentCode(assessment) {
    return assessment?.phase2Code || assessment?.phase1Code || assessment?.code || '';
}

function flattenAssessments(historyData) {
    const sessions = Array.isArray(historyData?.sessions) ? historyData.sessions : [];
    const directAssessments = Array.isArray(historyData?.assessments)
        ? historyData.assessments
        : [];

    const sessionAssessments = sessions.flatMap((session) => {
        const assessments = Array.isArray(session.assessments) ? session.assessments : [];
        return assessments.map((assessment) => {
            const status = normalizeStatus(assessment.status, assessment);
            const fullCode = buildAssessmentCode(assessment);
            // ✅ Pour Phase 1, on garde la première lettre comme code affiché
            const displayCode = assessment?.type === 'PHASE1' 
                ? getDominantLetter(fullCode) 
                : fullCode;
            
            return {
                id: assessment.id,
                assessmentId: assessment.id,
                sessionToken: session.sessionToken || null,
                shareToken: session.shareToken || null,
                type: assessment.type || 'RIASEC',
                title: buildAssessmentTitle(assessment),
                date: formatDate(
                    assessment.completedAt || assessment.startedAt || session.createdAt,
                ),
                completedAt: assessment.completedAt || null,
                startedAt: assessment.startedAt || null,
                status: status,
                score: Number(assessment.completionPercentage ?? 0),
                completionPercentage: Number(assessment.completionPercentage ?? 0),
                phase1Code: assessment.phase1Code || null,
                phase2Code: assessment.phase2Code || null,
                code: displayCode, // ✅ Code affiché (1 lettre pour Phase 1, complet pour Phase 2)
                fullCode: fullCode, // ✅ Code complet stocké séparément
                consistencyLevel: assessment.consistencyLevel || null,
                hasResult: Boolean(assessment.hasResult),
                hasTreasureMap: Boolean(assessment.hasTreasureMap),
                responses: assessment.responses || [],
                responseBatches: assessment.responseBatches || [],
                answeredQuestions: assessment.answeredQuestions || 0,
                raw: assessment,
            };
        });
    });

    const directList = directAssessments.map((assessment) => {
        const status = normalizeStatus(assessment.status, assessment);
        const fullCode = buildAssessmentCode(assessment);
        const displayCode = assessment?.type === 'PHASE1' 
            ? getDominantLetter(fullCode) 
            : fullCode;
            
        return {
            id: assessment.id,
            assessmentId: assessment.id,
            sessionToken: historyData?.sessionToken || null,
            shareToken: historyData?.shareToken || null,
            type: assessment.type || 'RIASEC',
            title: buildAssessmentTitle(assessment),
            date: formatDate(
                assessment.completedAt || assessment.startedAt || historyData?.createdAt,
            ),
            completedAt: assessment.completedAt || null,
            startedAt: assessment.startedAt || null,
            status: status,
            score: Number(assessment.completionPercentage ?? 0),
            completionPercentage: Number(assessment.completionPercentage ?? 0),
            phase1Code: assessment.phase1Code || null,
            phase2Code: assessment.phase2Code || null,
            code: displayCode,
            fullCode: fullCode,
            consistencyLevel: assessment.consistencyLevel || null,
            hasResult: Boolean(assessment.hasResult),
            hasTreasureMap: Boolean(assessment.hasTreasureMap),
            responses: assessment.responses || [],
            responseBatches: assessment.responseBatches || [],
            answeredQuestions: assessment.answeredQuestions || 0,
            raw: assessment,
        };
    });

    const combined = sessionAssessments.length > 0 ? sessionAssessments : directList;

    return combined.sort((left, right) => {
        const leftDate = new Date(left.completedAt || left.startedAt || 0).getTime();
        const rightDate = new Date(right.completedAt || right.startedAt || 0).getTime();
        return rightDate - leftDate;
    });
}

function buildEvolution(assessments) {
    const completed = assessments.filter((assessment) => assessment.status === 'completed');
    const averageScore =
        completed.length > 0
            ? Math.round(
                  completed.reduce(
                      (sum, assessment) => sum + Number(assessment.completionPercentage || 0),
                      0,
                  ) / completed.length,
              )
            : 0;
    const bestScore =
        completed.length > 0
            ? Math.max(
                  ...completed.map((assessment) => Number(assessment.completionPercentage || 0)),
              )
            : 0;
    const currentMonth = new Date().getMonth();
    const months = Array.from(
        { length: 4 },
        (_, index) => MONTHS[Math.max(0, currentMonth - 3 + index)],
    );

    const progression = months.map((month) => {
        const match = completed.find((assessment) => {
            const date = new Date(assessment.completedAt || assessment.startedAt || '');
            if (Number.isNaN(date.getTime())) return false;
            return MONTHS[date.getMonth()] === month;
        });

        return {
            month,
            score: match ? Number(match.completionPercentage || 0) : null,
        };
    });

    return {
        testsCompleted: completed.length,
        totalTests: assessments.length,
        averageScore,
        bestScore,
        progression,
    };
}

function getBadgeLabel(rarity) {
    const normalized = String(rarity || '').toUpperCase();
    if (normalized === 'EPIC') return 'Epic';
    if (normalized === 'RARE') return 'Rare';
    if (normalized === 'UNCOMMON') return 'Uncommon';
    return 'Commun';
}

export default function EspacePersonnel() {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [savingPdfId, setSavingPdfId] = useState(null);
    const [historyData, setHistoryData] = useState(null);
    const [recommendations, setRecommendations] = useState({});
    const [loadingRecos, setLoadingRecos] = useState({});
    const [savingScholarship, setSavingScholarship] = useState(null);
    const [saveMessage, setSaveMessage] = useState(null);

    const assessments = useMemo(() => flattenAssessments(historyData), [historyData]);
    const evolutionData = useMemo(() => buildEvolution(assessments), [assessments]);
    const bourses = Array.isArray(historyData?.bourses) ? historyData.bourses : [];
    const gamification = historyData?.gamification || {};

    const userInfo = useMemo(() => {
        const firstName = historyData?.firstName || '';
        const lastName = historyData?.lastName || '';
        const displayName =
            historyData?.displayName || [firstName, lastName].filter(Boolean).join(' ').trim();

        return {
            name: displayName || historyData?.email || 'Utilisateur',
            email: historyData?.email || '',
            bio: historyData?.bio || null,
        };
    }, [historyData]);

    const completedAssessments = assessments.filter(
        (assessment) => assessment.status === 'completed',
    );
    const inProgressAssessments = assessments.filter(
        (assessment) => assessment.status === 'in_progress',
    );
    const notStartedAssessments = assessments.filter(
        (assessment) => assessment.status === 'not_started',
    );
    const latestAssessment = assessments[0] || null;

    // Fonction pour sauvegarder une bourse
    const saveScholarship = useCallback(async (scholarshipId) => {
        if (!scholarshipId) return;

        setSavingScholarship(scholarshipId);

        try {
            const response = await api.post('/users/me/scholarship', null, {
                params: { scholarshipId: scholarshipId },
            });

            setSaveMessage({
                id: scholarshipId,
                text: '✓ Bourse sauvegardée avec succès !',
                type: 'success',
            });
            setTimeout(() => setSaveMessage(null), 3000);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            setSaveMessage({
                id: scholarshipId,
                text: '✗ Erreur lors de la sauvegarde',
                type: 'error',
            });
            setTimeout(() => setSaveMessage(null), 3000);
            return { success: false, error: error.response?.data?.message || error.message };
        } finally {
            setSavingScholarship(null);
        }
    }, []);

    const loadRecommendations = useCallback(async (assessmentId) => {
        if (!assessmentId) return null;

        setLoadingRecos((prev) => ({ ...prev, [assessmentId]: true }));

        try {
            const response = await api.get(
                `/users/me/assessments/${assessmentId}/recommendations`,
                {
                    params: { limit: 10 },
                },
            );
            return response.data;
        } catch (error) {
            console.error('Erreur chargement recommandations:', error);
            return null;
        } finally {
            setLoadingRecos((prev) => ({ ...prev, [assessmentId]: false }));
        }
    }, []);

    useEffect(() => {
        if (activeMenu === 'reports' && completedAssessments.length > 0) {
            completedAssessments.forEach(async (assessment) => {
                if (!recommendations[assessment.id]) {
                    const recos = await loadRecommendations(assessment.assessmentId);
                    if (recos) {
                        setRecommendations((prev) => ({ ...prev, [assessment.id]: recos }));
                    }
                }
            });
        }
    }, [activeMenu, completedAssessments, loadRecommendations, recommendations]);

    const loadHistory = useCallback(async () => {
        setLoading(true);
        setError('');

        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => {
            controller.abort();
        }, 8000);

        try {
            const response = await api.get('/users/me/history', {
                signal: controller.signal,
            });
            setHistoryData(response.data || null);
        } catch (apiError) {
            console.error('Erreur chargement historique:', apiError);
            if (apiError.name === 'CanceledError' || apiError.code === 'ERR_CANCELED') {
                setError('Le chargement a pris trop de temps. Réessayez dans quelques instants.');
            } else {
                setError(
                    apiError.response?.data?.message ||
                        'Impossible de charger votre espace personnel. Vérifiez votre connexion.',
                );
            }
        } finally {
            window.clearTimeout(timeoutId);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    const exportAssessmentPdf = useCallback(async (assessment) => {
        if (!assessment) return;

        setSavingPdfId(assessment.id);

        try {
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const title = assessment.type === 'PHASE1' ? 'Rapport Phase 1' : 'Rapport RIASEC';
            // ✅ Pour l'export PDF, on utilise le code complet si disponible, sinon le code affiché
            const code = assessment.fullCode || assessment.code || 'N/A';

            pdf.setFillColor(51, 71, 223);
            pdf.rect(0, 0, 210, 42, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(20);
            pdf.text(title, 20, 20);
            pdf.setFontSize(10);
            pdf.text(`Date: ${assessment.date}`, 20, 31);

            pdf.setTextColor(17, 24, 39);
            pdf.setFontSize(14);
            pdf.text(`Code: ${code}`, 20, 55);
            pdf.setFontSize(11);
            pdf.text(`Statut: ${STATUS_LABELS[assessment.status] || assessment.status}`, 20, 65);
            pdf.text(`Cohérence: ${assessment.consistencyLevel || 'Non renseignée'}`, 20, 73);
            pdf.text(`Complétion: ${assessment.completionPercentage}%`, 20, 81);

            pdf.setFontSize(12);
            pdf.text('Sources du rapport', 20, 97);
            pdf.setFontSize(10);
            pdf.text(`Session: ${assessment.sessionToken || 'non disponible'}`, 20, 106);
            pdf.text(`Assessment ID: ${assessment.assessmentId}`, 20, 114);

            if (assessment.hasTreasureMap) {
                pdf.text('Carte au trésor disponible.', 20, 126);
            }

            pdf.save(`${title.replace(/\s/g, '_')}_${assessment.assessmentId}.pdf`);
        } finally {
            setSavingPdfId(null);
        }
    }, []);

    const openAssessment = useCallback(
        (assessment) => {
            if (!assessment) return;

            if (assessment.type === 'PHASE1') {
                navigate('/rapport-phase1', {
                    state: {
                        assessmentId: assessment.assessmentId,
                        sessionToken: assessment.sessionToken,
                    },
                });
                return;
            }

            navigate('/orientations', {
                state: {
                    assessmentId: assessment.assessmentId,
                    sessionToken: assessment.sessionToken,
                },
            });
        },
        [navigate],
    );

    const resumeAssessment = useCallback(() => {
        navigate('/tests-orientations');
    }, [navigate]);

    if (loading) {
        return (
            <div className="espace-container">
                <div className="loading-container">
                    <div className="simple-loader"></div>
                    <p>Chargement de votre parcours...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="espace-container">
                <div className="loading-container">
                    <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</p>
                    <button className="new-test-btn" onClick={loadHistory}>
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="espace-container">
            <header className="espace-header">
                <div className="espace-header-content">
                    <h1>Mon parcours d'orientation</h1>
                </div>
                <div className="espace-header-stats">
                    <div className="stat-badge">
                        <span className="stat-number">{evolutionData.testsCompleted}</span>
                        <span className="stat-label">Tests complétés</span>
                    </div>
                </div>
            </header>

            <div className="espace-body">
                <aside className="espace-sidebar">
                    <div className="user-card" style={{ marginBottom: '1.5rem' }}>
                        <h3>{userInfo.name}</h3>
                        <p>{userInfo.email}</p>
                    </div>

                    <nav className="sidebar-nav">
                        {MENU_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                className={`nav-item ${activeMenu === item.id ? 'active' : ''}`}
                                onClick={() => setActiveMenu(item.id)}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    <div className="sidebar-footer">
                        <button className="help-btn" onClick={() => navigate('/support')}>
                            Aide
                        </button>
                        <button className="support-btn" onClick={() => navigate('/contact')}>
                            Contact
                        </button>
                    </div>
                </aside>

                <main className="espace-main">
                    {activeMenu === 'dashboard' && (
                        <section>
                            <div className="section-header">
                                <h2>
                                    <IconDashboard /> Vue d'ensemble
                                </h2>
                                <button className="new-test-btn" onClick={resumeAssessment}>
                                    Nouveau test
                                </button>
                            </div>

                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-icon">
                                        <IconHistory />
                                    </div>
                                    <div>
                                        <div className="stat-number">
                                            {evolutionData.totalTests}
                                        </div>
                                        <div className="stat-label">Total des évaluations</div>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">
                                        <IconChart />
                                    </div>
                                    <div>
                                        <div className="stat-number">
                                            {evolutionData.averageScore}
                                        </div>
                                        <div className="stat-label">Moyenne de complétion</div>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">
                                        <IconTrophy />
                                    </div>
                                    <div>
                                        <div className="stat-number">{evolutionData.bestScore}</div>
                                        <div className="stat-label">Meilleur score</div>
                                    </div>
                                </div>
                            </div>

                            <div className="advice-card">
                                <h3>Dernier test synchronisé</h3>
                                {latestAssessment ? (
                                    <div className="test-result">
                                        <div className="test-info">
                                            <strong>{latestAssessment.title}</strong>
                                            <div className="test-date">
                                                <IconCalendar /> {latestAssessment.date}
                                            </div>
                                            {/* ✅ Affichage du code avec la bonne logique */}
                                            {latestAssessment.code && (
                                                <div className="test-code" style={{ 
                                                    fontSize: '0.9rem', 
                                                    color: '#6b7280',
                                                    marginTop: '0.25rem'
                                                }}>
                                                    Code: {latestAssessment.code}
                                                    {latestAssessment.type === 'PHASE1' && latestAssessment.fullCode && latestAssessment.fullCode !== latestAssessment.code && (
                                                        <span style={{ fontSize: '0.8rem', color: '#9ca3af', marginLeft: '0.5rem' }}>
                                                            (complet: {latestAssessment.fullCode})
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="test-score-badge">
                                            {latestAssessment.completionPercentage}%
                                        </div>
                                    </div>
                                ) : (
                                    <p>Aucun test trouvé dans votre historique.</p>
                                )}
                            </div>

                            {inProgressAssessments.length > 0 && (
                                <div
                                    className="advice-card"
                                    style={{ marginTop: '1rem', borderLeft: '4px solid #f59e0b' }}
                                >
                                    <h3>📝 Tests en cours</h3>
                                    <p>
                                        Vous avez {inProgressAssessments.length} test(s) à terminer.
                                    </p>
                                    <button
                                        className="new-test-btn"
                                        onClick={resumeAssessment}
                                        style={{ marginTop: '0.5rem' }}
                                    >
                                        Continuer le test
                                    </button>
                                </div>
                            )}
                        </section>
                    )}

                    {activeMenu === 'tests' && (
                        <section>
                            <div className="section-header">
                                <h2>
                                    <IconHistory /> Mes tests
                                </h2>
                                <button className="new-test-btn" onClick={resumeAssessment}>
                                    Nouveau test
                                </button>
                            </div>

                            <div className="tests-list">
                                {assessments.length === 0 ? (
                                    <div className="advice-card">
                                        <p>Aucun test disponible pour le moment.</p>
                                    </div>
                                ) : (
                                    assessments.map((assessment) => (
                                        <div
                                            key={assessment.id}
                                            className={`test-card ${assessment.status !== 'completed' ? 'pending' : ''}`}
                                        >
                                            <div className="test-card-header">
                                                <div>
                                                    <h4>{assessment.title}</h4>
                                                    <div className="test-type">
                                                        {assessment.type}{' '}
                                                        {/* ✅ Affichage du code avec la bonne logique */}
                                                        {assessment.code && (
                                                            <span style={{ fontWeight: '500' }}>
                                                                - {assessment.code}
                                                                {assessment.type === 'PHASE1' && assessment.fullCode && assessment.fullCode !== assessment.code && (
                                                                    <span style={{ fontSize: '0.8rem', color: '#9ca3af', marginLeft: '0.3rem' }}>
                                                                        ({assessment.fullCode})
                                                                    </span>
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <span
                                                    className={`status-badge ${assessment.status === 'completed' ? 'completed' : assessment.status === 'in_progress' ? 'in-progress' : assessment.status === 'not_started' ? 'not-started' : 'pending'}`}
                                                >
                                                    {STATUS_LABELS[assessment.status] ||
                                                        assessment.status}
                                                </span>
                                            </div>

                                            <div className="test-card-body">
                                                <div className="test-meta">
                                                    <IconCalendar /> {assessment.date}
                                                </div>
                                                <div className="test-score-large">
                                                    <span className="score-number">
                                                        {assessment.completionPercentage}
                                                    </span>
                                                    <span className="score-max">%</span>
                                                </div>
                                            </div>

                                            <div className="test-card-footer">
                                                {assessment.status === 'in_progress' && (
                                                    <button
                                                        className="generate-btn"
                                                        onClick={resumeAssessment}
                                                    >
                                                        Continuer
                                                    </button>
                                                )}
                                                {assessment.status === 'completed' && (
                                                    <>
                                                        <button
                                                            className="btn-view"
                                                            onClick={() => openAssessment(assessment)}
                                                        >
                                                            Voir
                                                        </button>
                                                        <button
                                                            className="btn-view"
                                                            onClick={() => exportAssessmentPdf(assessment)}
                                                            disabled={savingPdfId === assessment.id}
                                                        >
                                                            {savingPdfId === assessment.id ? 'Export...' : 'PDF'}
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {notStartedAssessments.length > 0 && (
                                <div className="advice-card" style={{ marginTop: '1rem' }}>
                                    <h4>ℹ️ Tests non commencés</h4>
                                    <p>
                                        {notStartedAssessments.length} test(s) ont été créés mais
                                        vous n'avez pas encore commencé à répondre aux questions.
                                    </p>
                                </div>
                            )}
                        </section>
                    )}

                    {activeMenu === 'reports' && (
                        <section className="reports-content">
                            <div className="section-header">
                                <h2>
                                    <IconFile /> Rapports
                                </h2>
                                <button className="generate-btn" onClick={resumeAssessment}>
                                    Nouveau rapport
                                </button>
                            </div>

                            <div className="reports-grid">
                                {completedAssessments.length === 0 ? (
                                    <div className="advice-card">
                                        <p>Aucun rapport générable pour le moment.</p>
                                    </div>
                                ) : (
                                    completedAssessments.map((assessment) => {
                                        const recos = recommendations[assessment.id];
                                        const isLoading = loadingRecos[assessment.id];

                                        return (
                                            <div key={assessment.id} className="report-card">
                                                <div className="report-icon">
                                                    <IconFile />
                                                </div>
                                                <div className="report-info">
                                                    <h4>{assessment.title}</h4>
                                                    <div className="report-meta">
                                                        <span>
                                                            <IconCalendar /> {assessment.date}
                                                        </span>
                                                        <span>
                                                            <IconLoader />{' '}
                                                            {assessment.completionPercentage}%
                                                        </span>
                                                    </div>

                                                    {/* ✅ Affichage du code avec la bonne logique */}
                                                    {assessment.code && (
                                                        <div className="report-code-badge">
                                                            <strong>Code:</strong>{' '}
                                                            {assessment.code}
                                                            {assessment.type === 'PHASE1' && assessment.fullCode && assessment.fullCode !== assessment.code && (
                                                                <span style={{ fontSize: '0.8rem', color: '#9ca3af', marginLeft: '0.5rem' }}>
                                                                    (complet: {assessment.fullCode})
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="report-recommendations">
                                                        {isLoading ? (
                                                            <div className="reco-loading">
                                                                <div className="loader-small"></div>
                                                                <span>
                                                                    Chargement des
                                                                    recommandations...
                                                                </span>
                                                            </div>
                                                        ) : recos ? (
                                                            <>
                                                                {recos.careers &&
                                                                    recos.careers.length > 0 && (
                                                                        <div className="reco-section">
                                                                            <div className="reco-title">
                                                                                🎯 Métiers
                                                                                recommandés
                                                                            </div>
                                                                            <ul className="reco-list">
                                                                                {recos.careers
                                                                                    .slice(0, 5)
                                                                                    .map(
                                                                                        (
                                                                                            career,
                                                                                            idx,
                                                                                        ) => (
                                                                                            <li
                                                                                                key={
                                                                                                    idx
                                                                                                }
                                                                                            >
                                                                                                <span className="reco-icon">
                                                                                                    💼
                                                                                                </span>
                                                                                                {typeof career ===
                                                                                                'string'
                                                                                                    ? career
                                                                                                    : career.name}
                                                                                            </li>
                                                                                        ),
                                                                                    )}
                                                                            </ul>
                                                                        </div>
                                                                    )}
                                                                {recos.trainings &&
                                                                    recos.trainings.length > 0 && (
                                                                        <div className="reco-section">
                                                                            <div className="reco-title">
                                                                                📚 Formations
                                                                                recommandées
                                                                            </div>
                                                                            <ul className="reco-list">
                                                                                {recos.trainings
                                                                                    .slice(0, 5)
                                                                                    .map(
                                                                                        (
                                                                                            training,
                                                                                            idx,
                                                                                        ) => (
                                                                                            <li
                                                                                                key={
                                                                                                    idx
                                                                                                }
                                                                                            >
                                                                                                <span className="reco-icon">
                                                                                                    🏫
                                                                                                </span>
                                                                                                {typeof training ===
                                                                                                'string'
                                                                                                    ? training
                                                                                                    : training.name}
                                                                                            </li>
                                                                                        ),
                                                                                    )}
                                                                            </ul>
                                                                        </div>
                                                                    )}
                                                                {recos.schools &&
                                                                    recos.schools.length > 0 && (
                                                                        <div className="reco-section">
                                                                            <div className="reco-title">
                                                                                🎓 Écoles /
                                                                                Universités
                                                                            </div>
                                                                            <ul className="reco-list">
                                                                                {recos.schools
                                                                                    .slice(0, 5)
                                                                                    .map(
                                                                                        (
                                                                                            school,
                                                                                            idx,
                                                                                        ) => (
                                                                                            <li
                                                                                                key={
                                                                                                    idx
                                                                                                }
                                                                                            >
                                                                                                <span className="reco-icon">
                                                                                                    🏛️
                                                                                                </span>
                                                                                                {typeof school ===
                                                                                                'string'
                                                                                                    ? school
                                                                                                    : school.name}
                                                                                            </li>
                                                                                        ),
                                                                                    )}
                                                                            </ul>
                                                                        </div>
                                                                    )}
                                                                {recos.scholarships &&
                                                                    recos.scholarships.length >
                                                                        0 && (
                                                                        <div className="reco-section">
                                                                            <div className="reco-title">
                                                                                💰 Bourses
                                                                                disponibles
                                                                            </div>
                                                                            <ul className="reco-list">
                                                                                {recos.scholarships
                                                                                    .slice(0, 3)
                                                                                    .map(
                                                                                        (
                                                                                            scholarship,
                                                                                            idx,
                                                                                        ) => (
                                                                                            <li
                                                                                                key={
                                                                                                    idx
                                                                                                }
                                                                                            >
                                                                                                <span className="reco-icon">
                                                                                                    🎓
                                                                                                </span>
                                                                                                {typeof scholarship ===
                                                                                                'string'
                                                                                                    ? scholarship
                                                                                                    : scholarship.name}
                                                                                            </li>
                                                                                        ),
                                                                                    )}
                                                                            </ul>
                                                                        </div>
                                                                    )}
                                                            </>
                                                        ) : (
                                                            <div className="reco-empty">
                                                                <button
                                                                    className="load-reco-btn"
                                                                    onClick={async () => {
                                                                        const data =
                                                                            await loadRecommendations(
                                                                                assessment.assessmentId,
                                                                            );
                                                                        if (data) {
                                                                            setRecommendations(
                                                                                (prev) => ({
                                                                                    ...prev,
                                                                                    [assessment.id]:
                                                                                        data,
                                                                                }),
                                                                            );
                                                                        }
                                                                    }}
                                                                >
                                                                    Voir les métiers et formations
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="report-actions">
                                                    <button
                                                        className="action-icon"
                                                        onClick={() => openAssessment(assessment)}
                                                        title="Voir"
                                                    >
                                                        <IconEye />
                                                    </button>
                                                    <button
                                                        className="action-icon"
                                                        onClick={() =>
                                                            exportAssessmentPdf(assessment)
                                                        }
                                                        title="Télécharger"
                                                    >
                                                        <IconDownload />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </section>
                    )}

                    {activeMenu === 'bourses' && (
                        <section>
                            <div className="section-header">
                                <h2>
                                    <IconTrophy /> Bourses
                                </h2>
                                <button className="generate-btn" onClick={resumeAssessment}>
                                    Nouveau test
                                </button>
                            </div>

                            <div className="tests-list">
                                {bourses.length === 0 ? (
                                    <div className="advice-card">
                                        <p>Aucune bourse disponible pour le moment.</p>
                                    </div>
                                ) : (
                                    bourses.map((bourse) => (
                                        <div key={bourse.id} className="test-card">
                                            <div className="test-card-header">
                                                <div>
                                                    <h4>
                                                        {bourse.emoji ? `${bourse.emoji} ` : ''}
                                                        {bourse.name}
                                                    </h4>
                                                    <div className="test-type">
                                                        {bourse.description}
                                                    </div>
                                                </div>
                                                <span className="status-badge completed">
                                                    {getBadgeLabel(bourse.rarity)}
                                                </span>
                                            </div>
                                            <div className="test-card-body">
                                                <div className="test-meta">
                                                    Débloqué le {formatDate(bourse.unlockedAt)}
                                                </div>
                                                <div className="test-score-large">
                                                    <span className="score-number">
                                                        {bourse.pointsValue}
                                                    </span>
                                                </div>
                                            </div>
                                            {saveMessage && saveMessage.id === bourse.id && (
                                                <div className={`save-message ${saveMessage.type}`}>
                                                    {saveMessage.text}
                                                </div>
                                            )}
                                            <div className="test-card-footer">
                                                <button
                                                    className="save-scholarship-btn"
                                                    onClick={() => saveScholarship(bourse.id)}
                                                    disabled={savingScholarship === bourse.id}
                                                >
                                                    {savingScholarship === bourse.id ? (
                                                        <span className="btn-spinner"></span>
                                                    ) : (
                                                        <>
                                                            <IconBookmark /> Sauvegarder cette
                                                            bourse
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    )}

                    {activeMenu === 'profile' && (
                        <section>
                            <div className="section-header">
                                <h2>
                                    <IconUser /> Profil
                                </h2>
                            </div>

                            <div className="profile-form">
                                <div className="form-group">
                                    <label>Nom complet</label>
                                    <input type="text" value={userInfo.name} readOnly disabled />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" value={userInfo.email} readOnly disabled />
                                </div>
                            </div>

                            <div className="reports-summary">
                                <h3>
                                    <IconCheck /> Résumé
                                </h3>
                                <p>
                                    {completedAssessments.length} test(s) terminé(s),{' '}
                                    {inProgressAssessments.length} en cours,
                                    {notStartedAssessments.length} non commencé(s).
                                </p>
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}