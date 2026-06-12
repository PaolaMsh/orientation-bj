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
    <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path d="M6 3h12v3c0 3.5-2.5 6-6 6s-6-2.5-6-6V3z" />
        <path d="M8 12v3c0 1.5 1.5 3 4 3s4-1.5 4-3v-3" />
        <line x1="12" y1="18" x2="12" y2="21" />
        <line x1="9" y1="21" x2="15" y2="21" />
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

const MENU_ITEMS = [
    { id: 'dashboard', label: 'Tableau de bord', icon: <IconDashboard /> },
    { id: 'tests', label: 'Mes tests', icon: <IconHistory /> },
    { id: 'reports', label: 'Rapports', icon: <IconFile /> },
    { id: 'badges', label: 'Badges', icon: <IconTrophy /> },
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

function normalizeStatus(status) {
    const normalized = String(status || '').toLowerCase();
    if (normalized === 'completed') return 'completed';
    if (normalized === 'in_progress') return 'in_progress';
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
        return assessments.map((assessment) => ({
            id: assessment.id,
            assessmentId: assessment.id,
            sessionToken: session.sessionToken || null,
            shareToken: session.shareToken || null,
            type: assessment.type || 'RIASEC',
            title: buildAssessmentTitle(assessment),
            date: formatDate(assessment.completedAt || assessment.startedAt || session.createdAt),
            completedAt: assessment.completedAt || null,
            startedAt: assessment.startedAt || null,
            status: normalizeStatus(assessment.status),
            score: Number(assessment.completionPercentage ?? 0),
            completionPercentage: Number(assessment.completionPercentage ?? 0),
            phase1Code: assessment.phase1Code || null,
            phase2Code: assessment.phase2Code || null,
            code: buildAssessmentCode(assessment),
            consistencyLevel: assessment.consistencyLevel || null,
            hasResult: Boolean(assessment.hasResult),
            hasTreasureMap: Boolean(assessment.hasTreasureMap),
            raw: assessment,
        }));
    });

    const directList = directAssessments.map((assessment) => ({
        id: assessment.id,
        assessmentId: assessment.id,
        sessionToken: historyData?.sessionToken || null,
        shareToken: historyData?.shareToken || null,
        type: assessment.type || 'RIASEC',
        title: buildAssessmentTitle(assessment),
        date: formatDate(assessment.completedAt || assessment.startedAt || historyData?.createdAt),
        completedAt: assessment.completedAt || null,
        startedAt: assessment.startedAt || null,
        status: normalizeStatus(assessment.status),
        score: Number(assessment.completionPercentage ?? 0),
        completionPercentage: Number(assessment.completionPercentage ?? 0),
        phase1Code: assessment.phase1Code || null,
        phase2Code: assessment.phase2Code || null,
        code: buildAssessmentCode(assessment),
        consistencyLevel: assessment.consistencyLevel || null,
        hasResult: Boolean(assessment.hasResult),
        hasTreasureMap: Boolean(assessment.hasTreasureMap),
        raw: assessment,
    }));

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

    const assessments = useMemo(() => flattenAssessments(historyData), [historyData]);
    const evolutionData = useMemo(() => buildEvolution(assessments), [assessments]);
    const badges = Array.isArray(historyData?.badges) ? historyData.badges : [];
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
    const latestAssessment = assessments[0] || null;

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
            const code = assessment.code || 'N/A';

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
            pdf.text(`Coherence: ${assessment.consistencyLevel || 'Non renseignée'}`, 20, 73);
            pdf.text(`Completion: ${assessment.completionPercentage}%`, 20, 81);

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
                                        </div>
                                        <div className="test-score-badge">
                                            {latestAssessment.completionPercentage}%
                                        </div>
                                    </div>
                                ) : (
                                    <p>Aucun test trouvé dans votre historique.</p>
                                )}
                            </div>
                        </section>
                    )}

                    {activeMenu === 'tests' && (
                        <section>
                            <div className="section-header">
                                <h2>
                                    <IconHistory /> Mes tests
                                </h2>
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
                                                        {assessment.code
                                                            ? `- ${assessment.code}`
                                                            : ''}
                                                    </div>
                                                </div>
                                                <span
                                                    className={`status-badge ${assessment.status === 'completed' ? 'completed' : 'pending'}`}
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
                                                <button
                                                    className="btn-view"
                                                    onClick={() => openAssessment(assessment)}
                                                >
                                                    Voir les détails
                                                </button>
                                                <button
                                                    className="btn-view"
                                                    onClick={() => exportAssessmentPdf(assessment)}
                                                    disabled={savingPdfId === assessment.id}
                                                >
                                                    {savingPdfId === assessment.id
                                                        ? 'Export...'
                                                        : 'PDF'}
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
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
                                    completedAssessments.map((assessment) => (
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
                                                    onClick={() => exportAssessmentPdf(assessment)}
                                                    title="Télécharger"
                                                >
                                                    <IconDownload />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    )}

                    {activeMenu === 'badges' && (
                        <section>
                            <div className="section-header">
                                <h2>
                                    <IconTrophy /> Badges
                                </h2>
                            </div>

                            <div className="tests-list">
                                {badges.length === 0 ? (
                                    <div className="advice-card">
                                        <p>Aucun badge débloqué pour le moment.</p>
                                    </div>
                                ) : (
                                    badges.map((badge) => (
                                        <div key={badge.id} className="test-card">
                                            <div className="test-card-header">
                                                <div>
                                                    <h4>
                                                        {badge.emoji ? `${badge.emoji} ` : ''}
                                                        {badge.name}
                                                    </h4>
                                                    <div className="test-type">
                                                        {badge.description}
                                                    </div>
                                                </div>
                                                <span className="status-badge completed">
                                                    {getBadgeLabel(badge.rarity)}
                                                </span>
                                            </div>
                                            <div className="test-card-body">
                                                <div className="test-meta">
                                                    Débloqué le {formatDate(badge.unlockedAt)}
                                                </div>
                                                <div className="test-score-large">
                                                    <span className="score-number">
                                                        {badge.pointsValue}
                                                    </span>
                                                    <span className="score-max">XP</span>
                                                </div>
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
                                    {inProgressAssessments.length} en cours.
                                </p>
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}
