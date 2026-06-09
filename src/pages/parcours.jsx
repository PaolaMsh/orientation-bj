import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/parcours.css';

// ============ ICONES SVG ============

const IconUser = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const IconHistory = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const IconFile = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
);

const IconTrendUp = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
    </svg>
);

const IconDashboard = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
);

const IconDownload = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

const IconEye = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const IconCalendar = () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const IconScholarship = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
);

const IconEdit = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M17 3l4 4L7 21H3v-4L17 3z" />
    </svg>
);

const IconTarget = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
    </svg>
);

const IconCheck = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const IconChart = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
);

const IconTrophy = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M6 3h12v3c0 3.5-2.5 6-6 6s-6-2.5-6-6V3z" />
        <path d="M8 12v3c0 1.5 1.5 3 4 3s4-1.5 4-3v-3" />
        <line x1="12" y1="18" x2="12" y2="21" />
        <line x1="9" y1="21" x2="15" y2="21" />
    </svg>
);

const IconLightbulb = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9.5 19.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-1.5h-5z" />
        <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6v3h8v-3c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" />
        <line x1="9" y1="16" x2="15" y2="16" />
    </svg>
);

const IconClipboard = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="9" y="2" width="6" height="4" rx="1" />
        <path d="M9 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2h-2" />
        <line x1="9" y1="12" x2="15" y2="12" />
        <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
);

const IconPackage = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.29 7 12 12 20.71 7" />
        <line x1="12" y1="22" x2="12" y2="12" />
    </svg>
);

const IconHelpCircle = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);

const IconMail = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <polyline points="22 7 12 13 2 7" />
    </svg>
);

const IconTrash = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <polyline points="3 6 5 6 21 6" />
        <path d="M8 6V4h8v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);

const IconCode = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
    </svg>
);

const IconOpen = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginRight: '4px' }}>
        <circle cx="6" cy="6" r="5" fill="#22c55e" />
        <circle cx="6" cy="6" r="5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
    </svg>
);

const IconClosed = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginRight: '4px' }}>
        <circle cx="6" cy="6" r="5" fill="#ef4444" />
        <circle cx="6" cy="6" r="5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
    </svg>
);

const IconPrinter = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M6 9V3h12v6" />
        <path d="M6 21H4a2 2 0 01-2-2v-6a2 2 0 012-2h16a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
        <path d="M18 15v6H6v-6" />
        <rect x="8" y="11" width="8" height="2" />
    </svg>
);

const IconPlus = () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const IconArrowRight = () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

const IconBuilding = () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <line x1="9" y1="7" x2="15" y2="7" />
        <line x1="9" y1="12" x2="15" y2="12" />
        <line x1="9" y1="17" x2="13" y2="17" />
    </svg>
);

export default function EspacePersonnel() {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [userInfo, setUserInfo] = useState({
        name: 'Koffi Amoussou',
        email: 'koffi.amoussou@email.bj',
        phone: '+229 97 12 34 56',
        location: 'Cotonou',
        memberSince: 'Mars 2025',
    });

    const [testHistory, setTestHistory] = useState([]);
    const [pdfReports, setPdfReports] = useState([]);
    const [savedScholarships, setSavedScholarships] = useState([]);
    const [evolutionData, setEvolutionData] = useState({
        testsCompleted: 0,
        totalTests: 0,
        averageScore: 0,
        bestScore: 0,
        progression: [],
    });

    const updateEvolutionData = useCallback((tests) => {
        const completedTests = tests.filter((t) => t.status === 'completed');
        const completedCount = completedTests.length;
        const totalCount = tests.length;
        const avgScore = completedCount > 0
            ? Math.round(completedTests.reduce((sum, t) => sum + t.score, 0) / completedCount)
            : 0;
        const bestScore = completedCount > 0 ? Math.max(...completedTests.map((t) => t.score)) : 0;

        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        const currentMonthIndex = new Date().getMonth();
        const lastThreeMonths = months.slice(Math.max(0, currentMonthIndex - 2), currentMonthIndex + 1);

        const progression = lastThreeMonths.map((month) => {
            const testInMonth = completedTests.find((t) => t.date && t.date.includes(month));
            return { month: month, score: testInMonth ? testInMonth.score : null };
        });

        setEvolutionData({
            testsCompleted: completedCount,
            totalTests: totalCount,
            averageScore: avgScore,
            bestScore: bestScore,
            progression: progression,
        });
    }, []);

    useEffect(() => {
        loadUserData();
        loadTestHistory();
        loadPdfReports();
        loadSavedScholarships();
    }, []);

    const loadUserData = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setUserInfo((prev) => ({ ...prev, ...user }));
                setEditFormData(user);
            } catch (e) {}
        } else {
            setEditFormData(userInfo);
        }
    };

    const loadTestHistory = () => {
        const storedTests = localStorage.getItem('testHistory');
        if (storedTests) {
            try {
                const tests = JSON.parse(storedTests);
                setTestHistory(tests);
                updateEvolutionData(tests);
            } catch (e) {}
        } else {
            setTestHistory([]);
            updateEvolutionData([]);
        }
    };

    const loadPdfReports = () => {
        const storedReports = localStorage.getItem('pdfReports');
        if (storedReports) {
            try {
                const reports = JSON.parse(storedReports);
                setPdfReports(reports);
            } catch (e) {}
        }
    };

    const loadSavedScholarships = () => {
        const stored = localStorage.getItem('savedScholarships');
        if (stored) {
            try {
                const scholarships = JSON.parse(stored);
                setSavedScholarships(scholarships);
            } catch (e) {}
        }
    };

    const saveTestResult = useCallback((testResult) => {
        const newTest = {
            id: Date.now(),
            title: testResult.title || "Test d'orientation",
            date: new Date().toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            }),
            score: testResult.score,
            type: testResult.type || 'RIASEC',
            code: testResult.code || '',
            status: 'completed',
            fullReport: testResult.fullReport || {},
        };

        setTestHistory((prevHistory) => {
            const updatedHistory = [newTest, ...prevHistory];
            localStorage.setItem('testHistory', JSON.stringify(updatedHistory));
            updateEvolutionData(updatedHistory);
            return updatedHistory;
        });

        setPdfReports((prevReports) => {
            const newReport = {
                id: Date.now(),
                title: `Rapport ${newTest.type} - ${newTest.date}`,
                date: newTest.date,
                size: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 9)} Mo`,
                type: newTest.type.toLowerCase(),
                testId: newTest.id,
                content: newTest.fullReport,
            };
            const updatedReports = [newReport, ...prevReports];
            localStorage.setItem('pdfReports', JSON.stringify(updatedReports));
            return updatedReports;
        });

        return newTest;
    }, [updateEvolutionData]);

    const handleEditProfile = () => {
        setIsEditingProfile(true);
        setEditFormData({ ...userInfo });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = () => {
        if (!editFormData.name || !editFormData.email) {
            alert('Veuillez remplir les champs obligatoires (nom et email)');
            return;
        }
        setUserInfo(editFormData);
        localStorage.setItem('user', JSON.stringify(editFormData));
        setIsEditingProfile(false);
        alert('Profil mis à jour avec succès !');
    };

    const handleCancelEdit = () => {
        setIsEditingProfile(false);
        setEditFormData(userInfo);
    };

    const handleDownloadReport = (report) => {
        const reportContent = {
            title: report.title,
            date: report.date,
            type: report.type,
            content: report.content || { message: "Contenu du rapport d'orientation" },
        };
        const blob = new Blob([JSON.stringify(reportContent, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${report.title.replace(/\s/g, '_')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert(`Téléchargement de "${report.title}" terminé !`);
    };

    const handleDownloadAllReports = () => {
        if (pdfReports.length === 0) {
            alert('Aucun rapport à télécharger.');
            return;
        }
        const allReportsContent = {
            generatedAt: new Date().toISOString(),
            user: userInfo.name,
            totalReports: pdfReports.length,
            reports: pdfReports,
        };
        const blob = new Blob([JSON.stringify(allReportsContent, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tous_les_rapports_${userInfo.name.replace(/\s/g, '_')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert(`Téléchargement de ${pdfReports.length} rapport(s) terminé !`);
    };

    const handleViewReport = (report) => {
        const reportWindow = window.open('', '_blank');
        reportWindow.document.write(`
            <html>
                <head>
                    <title>${report.title}</title>
                    <style>
                        body { font-family: 'Inter', sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
                        h1 { color: #3347df; }
                        .meta { color: #666; margin-bottom: 20px; }
                        pre { background: #f5f5f5; padding: 15px; border-radius: 8px; overflow-x: auto; }
                        button { margin: 20px 10px 0 0; padding: 10px 20px; background: #3347df; color: white; border: none; border-radius: 8px; cursor: pointer; }
                    </style>
                </head>
                <body>
                    <h1>${report.title}</h1>
                    <div class="meta"><IconCalendar style={{ display: 'inline' }} /> ${report.date} | <IconChart /> ${report.type}</div>
                    <pre>${JSON.stringify(report.content || { message: "Contenu du rapport d'orientation" }, null, 2)}</pre>
                    <button onclick="window.print()"><IconPrinter /> Imprimer</button>
                    <button onclick="window.close()">Fermer</button>
                </body>
            </html>
        `);
        reportWindow.document.close();
    };

    const handleResumeTest = (test) => {
        if (test.type === 'RIASEC') {
            navigate('/orientations');
        } else {
            navigate('/tests');
        }
    };

    const handleRemoveScholarship = (id) => {
        const updated = savedScholarships.filter((s) => s.id !== id);
        setSavedScholarships(updated);
        localStorage.setItem('savedScholarships', JSON.stringify(updated));
        alert('Bourse retirée des favoris');
    };

    useEffect(() => {
        const handleNewTestResult = (event) => {
            if (event.detail && event.detail.testResult) {
                saveTestResult(event.detail.testResult);
            }
        };

        window.addEventListener('newTestResult', handleNewTestResult);

        const pendingTest = sessionStorage.getItem('pendingTestResult');
        if (pendingTest) {
            try {
                const testResult = JSON.parse(pendingTest);
                saveTestResult(testResult);
                sessionStorage.removeItem('pendingTestResult');
            } catch (e) {}
        }

        return () => {
            window.removeEventListener('newTestResult', handleNewTestResult);
        };
    }, [saveTestResult]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                loadTestHistory();
                loadPdfReports();
                loadSavedScholarships();
            }
        };

        const handleStorageChange = (e) => {
            if (e.key === 'testHistory') {
                loadTestHistory();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('storage', handleStorageChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const menuItems = [
        { id: 'dashboard', label: 'Tableau de bord', icon: <IconDashboard /> },
        { id: 'history', label: 'Historique des tests', icon: <IconHistory /> },
        { id: 'reports', label: 'Rapports PDF', icon: <IconFile /> },
        { id: 'evolution', label: 'Suivi évolution', icon: <IconTrendUp /> },
        { id: 'scholarships', label: 'Bourses enregistrées', icon: <IconScholarship /> },
        { id: 'profile', label: 'Mon profil', icon: <IconUser /> },
    ];

    const lastTest = testHistory.filter((t) => t.status === 'completed')[0];

    return (
        <div className="espace-container">
            <div className="espace-header">
                <div className="espace-header-content">
                    <h1><IconUser /> Espace personnel</h1>
                    <p>Suivez votre parcours d'orientation</p>
                </div>
                <div className="espace-header-stats">
                    <div className="stat-badge">
                        <span className="stat-number">{evolutionData.testsCompleted}</span>
                        <span className="stat-label">Tests réalisés</span>
                    </div>
                    <div className="stat-badge">
                        <span className="stat-number">
                            {evolutionData.totalTests > 0
                                ? Math.round((evolutionData.testsCompleted / evolutionData.totalTests) * 100)
                                : 0}%
                        </span>
                        <span className="stat-label">Profil complété</span>
                    </div>
                    <div className="stat-badge">
                        <span className="stat-number">{evolutionData.bestScore}</span>
                        <span className="stat-label">Meilleur score</span>
                    </div>
                </div>
            </div>

            <div className="espace-body">
                <aside className="espace-sidebar">
                    <div className="user-card">
                        <h3>{userInfo.name}</h3>
                        <p>{userInfo.location}</p>
                    </div>
                    <nav className="sidebar-nav">
                        {menuItems.map((item) => (
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
                        <button className="help-btn" onClick={() => navigate('/contact')}>
                            <IconHelpCircle /> Aide
                        </button>
                        <button className="support-btn" onClick={() => navigate('/support')}>
                            <IconMail /> Support
                        </button>
                    </div>
                </aside>

                <main className="espace-main">
                    {/* DASHBOARD */}
                    {activeMenu === 'dashboard' && (
                        <div className="dashboard-content">
                            <h2><IconDashboard /> Aperçu de votre parcours</h2>

                            <div className="progress-card">
                                <h3> Progression globale</h3>
                                <div className="progress-bar-container">
                                    <div className="progress-bar" style={{
                                        width: `${evolutionData.totalTests > 0 ? (evolutionData.testsCompleted / evolutionData.totalTests) * 100 : 0}%`
                                    }}></div>
                                </div>
                                <div className="progress-details">
                                    <span><IconCheck /> {evolutionData.testsCompleted}/{evolutionData.totalTests || 0} tests complétés</span>
                                    <span><IconChart /> Score moyen: {evolutionData.averageScore}/100</span>
                                </div>
                            </div>

                            <div className="last-test-card">
                                <h3> Dernier test réalisé</h3>
                                {lastTest ? (
                                    <div className="test-result">
                                        <div className="test-info">
                                            <strong>{lastTest.title}</strong>
                                            <span className="test-date"><IconCalendar /> {lastTest.date}</span>
                                        </div>
                                        <div className="test-score-badge">{lastTest.score}/100</div>
                                        {lastTest.code && <div className="test-code-badge">Code: {lastTest.code}</div>}
                                    </div>
                                ) : (
                                    <div className="no-test-message">
                                        <p>Aucun test réalisé pour le moment.</p>
                                    </div>
                                )}
                                {lastTest && (
                                    <button className="view-details-btn" onClick={() => setActiveMenu('history')}>
                                        Voir l'historique <IconArrowRight />
                                    </button>
                                )}
                            </div>

                            <div className="quick-actions">
                                <h3> Actions rapides</h3>
                                <div className="actions-grid">
                                    <button className="action-card" onClick={() => navigate('/tests')}>
                                        <IconClipboard /> Nouveau test
                                    </button>
                                    <button className="action-card" onClick={() => setActiveMenu('reports')}>
                                        <IconFile /> Mes rapports
                                    </button>
                                    <button className="action-card" onClick={() => navigate('/bourses-aides')}>
                                        <IconScholarship /> Bourses
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* HISTORIQUE DES TESTS */}
                    {activeMenu === 'history' && (
                        <div className="history-content">
                            <div className="section-header">
                                <h2><IconHistory /> Historique des tests</h2>
                                <button className="new-test-btn" onClick={() => navigate('/tests')}>
                                    <IconPlus /> Nouveau test
                                </button>
                            </div>
                            <div className="tests-list">
                                {testHistory.length === 0 ? (
                                    <div className="empty-state">
                                        <p>Aucun test réalisé pour le moment.</p>
                                        <button className="new-test-btn" onClick={() => navigate('/tests')}>
                                            Commencer un test
                                        </button>
                                    </div>
                                ) : (
                                    testHistory.map((test) => (
                                        <div key={test.id} className="test-card">
                                            <div className="test-card-header">
                                                <div>
                                                    <h4>{test.title}</h4>
                                                    <span className="test-type">{test.type}</span>
                                                </div>
                                                <span className="status-badge completed">
                                                    <IconCheck /> Terminé
                                                </span>
                                            </div>
                                            <div className="test-card-body">
                                                <div className="test-meta"><IconCalendar /> {test.date}</div>
                                                <div className="test-score-large">
                                                    <span className="score-number">{test.score}</span>
                                                    <span className="score-max">/100</span>
                                                </div>
                                                {test.code && <div className="test-code">Code RIASEC: <strong>{test.code}</strong></div>}
                                            </div>
                                            <div className="test-card-footer">
                                                <button className="btn-resume" onClick={() => handleResumeTest(test)}>
                                                    Voir les détails
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* RAPPORTS PDF */}
                    {activeMenu === 'reports' && (
                        <div className="reports-content">
                            <div className="section-header">
                                <h2><IconFile /> Mes rapports PDF</h2>
                            </div>
                            <div className="reports-grid">
                                {pdfReports.length === 0 ? (
                                    <div className="empty-state">
                                        <p>Aucun rapport disponible. Passez un test pour générer votre premier rapport.</p>
                                        <button className="new-test-btn" onClick={() => navigate('/tests')}>
                                            Commencer un test
                                        </button>
                                    </div>
                                ) : (
                                    pdfReports.map((report) => (
                                        <div key={report.id} className="report-card">
                                            <div className="report-icon"><IconFile /></div>
                                            <div className="report-info">
                                                <h4>{report.title}</h4>
                                                <div className="report-meta">
                                                    <span><IconCalendar /> {report.date}</span>
                                                    <span><IconDownload /> {report.size}</span>
                                                </div>
                                            </div>
                                            <div className="report-actions">
                                                <button className="action-icon" onClick={() => handleViewReport(report)} title="Voir">
                                                    <IconEye />
                                                </button>
                                                <button className="action-icon" onClick={() => handleDownloadReport(report)} title="Télécharger">
                                                    <IconDownload />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            {pdfReports.length > 0 && (
                                <div className="reports-summary">
                                    <h3><IconChart /> Bilan personnalisé</h3>
                                    <p>Vous avez {pdfReports.length} rapport(s) disponible(s) dans votre espace.</p>
                                    <button className="download-all-btn" onClick={handleDownloadAllReports}>
                                        <IconPackage /> Télécharger tous les rapports
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* SUIVI ÉVOLUTION */}
                    {activeMenu === 'evolution' && (
                        <div className="evolution-content">
                            <h2><IconTrendUp /> Évolution de vos performances</h2>
                            <div className="chart-card">
                                <h3>Progression des scores</h3>
                                <div className="simple-chart">
                                    {evolutionData.progression.map((item, idx) => (
                                        <div key={idx} className="chart-bar-wrapper">
                                            <div className="chart-bar" style={{
                                                height: item.score ? `${item.score}%` : '0%',
                                                backgroundColor: item.score ? '#3347df' : '#e5e7eb'
                                            }}>
                                                {item.score && <span className="bar-value">{item.score}</span>}
                                            </div>
                                            <span className="bar-label">{item.month}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-icon"><IconTrophy /></div>
                                    <div>
                                        <div className="stat-number">{evolutionData.bestScore}</div>
                                        <div className="stat-label">Meilleur score</div>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon"><IconChart /></div>
                                    <div>
                                        <div className="stat-number">{evolutionData.averageScore}</div>
                                        <div className="stat-label">Moyenne générale</div>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon"><IconCheck /></div>
                                    <div>
                                        <div className="stat-number">{evolutionData.testsCompleted}</div>
                                        <div className="stat-label">Tests complétés</div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    )}

                    {/* BOURSES ENREGISTRÉES */}
                    {activeMenu === 'scholarships' && (
                        <div className="scholarships-content">
                            <div className="section-header">
                                <h2><IconScholarship /> Bourses enregistrées</h2>
                            </div>
                            <div className="scholarships-list">
                                {savedScholarships.length === 0 ? (
                                    <div className="empty-state">
                                        <p>Aucune bourse enregistrée pour le moment.</p>
                                        <button className="new-test-btn" onClick={() => navigate('/bourses-aides')}>
                                            Explorer les bourses
                                        </button>
                                    </div>
                                ) : (
                                    savedScholarships.map((scholarship) => (
                                        <div key={scholarship.id} className="scholarship-card">
                                            <div className="scholarship-header">
                                                <h4>{scholarship.title}</h4>
                                                <span className={`scholarship-status ${scholarship.status === 'ouvert' ? 'open' : 'closed'}`}>
                                                    {scholarship.status === 'ouvert' ? <IconOpen /> : <IconClosed />}
                                                    {scholarship.status === 'ouvert' ? 'Ouvert' : 'Fermé'}
                                                </span>
                                            </div>
                                            <div className="scholarship-body">
                                                <p className="scholarship-description">{scholarship.description}</p>
                                                <div className="scholarship-details">
                                                    <span><IconScholarship /> {scholarship.amount || 'Montant non spécifié'}</span>
                                                    <span><IconCalendar /> {scholarship.deadline || 'Non spécifiée'}</span>
                                                    <span><IconBuilding /> {scholarship.country || 'Bénin'}</span>
                                                </div>
                                            </div>
                                            <div className="scholarship-footer">
                                                <button className="btn-view" onClick={() => window.open(scholarship.link, '_blank')}>
                                                    Voir les détails
                                                </button>
                                                <button className="btn-remove" onClick={() => handleRemoveScholarship(scholarship.id)}>
                                                     Retirer
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            {savedScholarships.length > 0 && (
                                <div className="scholarships-summary">
                                    <h3><IconChart /> Résumé</h3>
                                    <p>Vous avez {savedScholarships.length} bourse(s) enregistrée(s).</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* MON PROFIL */}
                    {activeMenu === 'profile' && (
                        <div className="profile-content">
                            <div className="section-header">
                                <h2><IconUser /> Informations personnelles</h2>
                                {!isEditingProfile && (
                                    <button className="edit-profile-btn" onClick={handleEditProfile}>
                                        <IconEdit /> Modifier
                                    </button>
                                )}
                            </div>
                            <div className="profile-form">
                                {isEditingProfile ? (
                                    <>
                                        <div className="form-group">
                                            <label>Nom complet *</label>
                                            <input type="text" name="name" value={editFormData.name || ''} onChange={handleInputChange} placeholder="Votre nom complet" />
                                        </div>
                                        <div className="form-group">
                                            <label>Email *</label>
                                            <input type="email" name="email" value={editFormData.email || ''} onChange={handleInputChange} placeholder="votre@email.com" />
                                        </div>
                                        <div className="form-group">
                                            <label>Téléphone</label>
                                            <input type="tel" name="phone" value={editFormData.phone || ''} onChange={handleInputChange} placeholder="+229 XX XX XX XX" />
                                        </div>
                                        <div className="form-group">
                                            <label>Ville</label>
                                            <input type="text" name="location" value={editFormData.location || ''} onChange={handleInputChange} placeholder="Votre ville" />
                                        </div>
                                        <div className="profile-actions editing-actions">
                                            <button className="save-profile-btn" onClick={handleSaveProfile}>Enregistrer</button>
                                            <button className="cancel-edit-btn" onClick={handleCancelEdit}>Annuler</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="form-group"><label>Nom complet</label><input type="text" value={userInfo.name} readOnly disabled /></div>
                                        <div className="form-group"><label>Email</label><input type="email" value={userInfo.email} readOnly disabled /></div>
                                        <div className="form-group"><label>Téléphone</label><input type="tel" value={userInfo.phone} readOnly disabled /></div>
                                        <div className="form-group"><label>Ville</label><input type="text" value={userInfo.location} readOnly disabled /></div>
                                        <div className="form-group"><label>Membre depuis</label><input type="text" value={userInfo.memberSince} readOnly disabled /></div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

// Fonctions globales exportées
export const saveTestResultGlobal = (testResult) => {
    sessionStorage.setItem('pendingTestResult', JSON.stringify(testResult));
    window.dispatchEvent(new CustomEvent('newTestResult', { detail: { testResult } }));

    const storedTests = localStorage.getItem('testHistory');
    let tests = storedTests ? JSON.parse(storedTests) : [];
    
    const newTest = {
        id: Date.now(),
        title: testResult.title || "Test d'orientation",
        date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
        score: testResult.score,
        type: testResult.type || 'RIASEC',
        code: testResult.code || '',
        status: 'completed',
        fullReport: testResult.fullReport || {},
    };
    
    tests.unshift(newTest);
    localStorage.setItem('testHistory', JSON.stringify(tests));
};

export const saveScholarship = (scholarship) => {
    const stored = localStorage.getItem('savedScholarships');
    let savedList = stored ? JSON.parse(stored) : [];
    
    if (!savedList.some((s) => s.id === scholarship.id)) {
        const newList = [...savedList, scholarship];
        localStorage.setItem('savedScholarships', JSON.stringify(newList));
        window.dispatchEvent(new CustomEvent('newScholarshipSaved', { detail: { scholarship } }));
        return true;
    }
    return false;
};