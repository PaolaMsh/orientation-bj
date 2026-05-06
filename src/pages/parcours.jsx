// EspacePersonnel.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/parcours.css';

// Icônes réutilisables
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
        <polyline points="10 9 9 9 8 9" />
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

const IconSave = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
    </svg>
);

const IconCancel = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
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
        memberSince: 'Mars 2025'
    });

    const [testHistory, setTestHistory] = useState([]);
    const [pdfReports, setPdfReports] = useState([]);
    const [savedScholarships, setSavedScholarships] = useState([]);
    const [evolutionData, setEvolutionData] = useState({
        testsCompleted: 0,
        totalTests: 0,
        averageScore: 0,
        bestScore: 0,
        progression: []
    });

    // Fonction pour mettre à jour les données d'évolution
    const updateEvolutionData = useCallback((tests) => {
        const completedTests = tests.filter(t => t.status === 'completed');
        const completedCount = completedTests.length;
        const totalCount = tests.length;
        const avgScore = completedCount > 0 
            ? Math.round(completedTests.reduce((sum, t) => sum + t.score, 0) / completedCount)
            : 0;
        const bestScore = completedCount > 0 
            ? Math.max(...completedTests.map(t => t.score))
            : 0;

        // Mois dynamiques (3 derniers mois)
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        const currentMonthIndex = new Date().getMonth();
        const lastThreeMonths = months.slice(Math.max(0, currentMonthIndex - 2), currentMonthIndex + 1);
        
        const progression = lastThreeMonths.map(month => {
            const testInMonth = completedTests.find(t => t.date && t.date.includes(month));
            return { month: month, score: testInMonth ? testInMonth.score : null };
        });

        setEvolutionData({
            testsCompleted: completedCount,
            totalTests: totalCount,
            averageScore: avgScore,
            bestScore: bestScore,
            progression: progression
        });
    }, []);

    // Charger les données depuis localStorage au démarrage
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
                setUserInfo(prev => ({ ...prev, ...user }));
                setEditFormData(user);
            } catch(e) {}
        } else {
            setEditFormData(userInfo);
        }
    };

    const loadTestHistory = () => {
        const storedTests = localStorage.getItem('testHistory');
        console.log('📂 Chargement testHistory:', storedTests);
        if (storedTests) {
            try {
                const tests = JSON.parse(storedTests);
                setTestHistory(tests);
                updateEvolutionData(tests);
            } catch(e) {
                console.error('Erreur parsing:', e);
            }
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
            } catch(e) {}
        }
    };

    const loadSavedScholarships = () => {
        const stored = localStorage.getItem('savedScholarships');
        if (stored) {
            try {
                const scholarships = JSON.parse(stored);
                setSavedScholarships(scholarships);
            } catch(e) {}
        }
    };

    // ✅ Sauvegarde d'un résultat de test - MISE À JOUR IMMÉDIATE
    const saveTestResult = useCallback((testResult) => {
        console.log('💾 Sauvegarde immédiate du test:', testResult);
        
        const newTest = {
            id: Date.now(),
            title: testResult.title || "Test d'orientation",
            date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
            score: testResult.score,
            type: testResult.type || "RIASEC",
            code: testResult.code || "",
            status: "completed",
            fullReport: testResult.fullReport || {}
        };

        // MISE À JOUR IMMÉDIATE de l'état (sans attendre localStorage)
        setTestHistory(prevHistory => {
            const updatedHistory = [newTest, ...prevHistory];
            // Sauvegarde dans localStorage
            localStorage.setItem('testHistory', JSON.stringify(updatedHistory));
            // Met à jour les données d'évolution
            updateEvolutionData(updatedHistory);
            console.log('✅ Historique mis à jour:', updatedHistory.length, 'tests');
            return updatedHistory;
        });
        
        // Générer un rapport PDF associé
        setPdfReports(prevReports => {
            const newReport = {
                id: Date.now(),
                title: `Rapport ${newTest.type} - ${newTest.date}`,
                date: newTest.date,
                size: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 9)} Mo`,
                type: newTest.type.toLowerCase(),
                testId: newTest.id,
                content: newTest.fullReport
            };
            const updatedReports = [newReport, ...prevReports];
            localStorage.setItem('pdfReports', JSON.stringify(updatedReports));
            return updatedReports;
        });
        
        // Notification visuelle
        alert(`✅ Test "${newTest.title}" enregistré ! Score: ${newTest.score}/100`);
        
        // Si on est sur le tableau de bord, forcer un petit re-render
        if (activeMenu === 'dashboard') {
            setActiveMenu('dashboard'); // Force refresh du dashboard
        }
        
        return newTest;
    }, [updateEvolutionData, activeMenu]);

    // Mise à jour du profil
    const handleEditProfile = () => {
        setIsEditingProfile(true);
        setEditFormData({ ...userInfo });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
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
            content: report.content || { message: "Contenu du rapport d'orientation" }
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
            alert("Aucun rapport à télécharger.");
            return;
        }

        const allReportsContent = {
            generatedAt: new Date().toISOString(),
            user: userInfo.name,
            totalReports: pdfReports.length,
            reports: pdfReports
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
                    <div class="meta">📅 ${report.date} | 📊 ${report.type}</div>
                    <pre>${JSON.stringify(report.content || { message: "Contenu du rapport d'orientation" }, null, 2)}</pre>
                    <button onclick="window.print()">🖨️ Imprimer</button>
                    <button onclick="window.close()">❌ Fermer</button>
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
        const updated = savedScholarships.filter(s => s.id !== id);
        setSavedScholarships(updated);
        localStorage.setItem('savedScholarships', JSON.stringify(updated));
        alert('Bourse retirée des favoris');
    };

    // ✅ Écouter les événements de nouveau test en temps réel
    useEffect(() => {
        const handleNewTestResult = (event) => {
            console.log('📡 Événement reçu en temps réel:', event.detail);
            if (event.detail && event.detail.testResult) {
                // Sauvegarde immédiate
                saveTestResult(event.detail.testResult);
            }
        };
        
        window.addEventListener('newTestResult', handleNewTestResult);
        
        // Vérifier s'il y a un test en attente (utile après redirection)
        const pendingTest = sessionStorage.getItem('pendingTestResult');
        if (pendingTest) {
            try {
                const testResult = JSON.parse(pendingTest);
                console.log('📦 Test en attente détecté:', testResult);
                saveTestResult(testResult);
                sessionStorage.removeItem('pendingTestResult');
            } catch(e) {
                console.error('Erreur:', e);
            }
        }
        
        return () => {
            window.removeEventListener('newTestResult', handleNewTestResult);
        };
    }, [saveTestResult]);

    // ✅ Rafraîchir les données quand la page devient visible
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                console.log('👁️ Page visible - vérification des nouvelles données');
                loadTestHistory();
                loadPdfReports();
                loadSavedScholarships();
            }
        };
        
        const handleStorageChange = (e) => {
            if (e.key === 'testHistory') {
                console.log('🔄 Changement localStorage détecté');
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
        { id: 'profile', label: 'Mon profil', icon: <IconUser /> }
    ];

    // Nombre de tests complétés pour affichage
    const completedTestsCount = testHistory.filter(t => t.status === 'completed').length;
    const lastTest = testHistory.filter(t => t.status === 'completed')[0];

    return (
        <div className="espace-container">
            {/* En-tête avec stats en temps réel */}
            <div className="espace-header">
                <div className="espace-header-content">
                    <h1> Espace personnel</h1>
                    <p>Suivez votre parcours d'orientation</p>
                </div>
                <div className="espace-header-stats">
                    <div className="stat-badge">
                        <span className="stat-number">{evolutionData.testsCompleted}</span>
                        <span className="stat-label">Tests réalisés</span>
                    </div>
                    <div className="stat-badge">
                        <span className="stat-number">{evolutionData.totalTests > 0 ? Math.round((evolutionData.testsCompleted / evolutionData.totalTests) * 100) : 0}%</span>
                        <span className="stat-label">Profil complété</span>
                    </div>
                    <div className="stat-badge">
                        <span className="stat-number">{evolutionData.bestScore}</span>
                        <span className="stat-label">Meilleur score</span>
                    </div>
                </div>
            </div>

            {/* Corps principal */}
            <div className="espace-body">
                <aside className="espace-sidebar">
                    <div className="user-card">
                        <h3>{userInfo.name}</h3>
                        <p>{userInfo.location}</p>
                    </div>
                    <nav className="sidebar-nav">
                        {menuItems.map(item => (
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
                        <button className="help-btn" onClick={() => navigate('/contact')}>❓ Aide</button>
                        <button className="support-btn" onClick={() => navigate('/support')}>📧 Support</button>
                    </div>
                </aside>

                <main className="espace-main">
                    {/* DASHBOARD - Affichage en temps réel */}
                    {activeMenu === 'dashboard' && (
                        <div className="dashboard-content">
                            <h2>Aperçu de votre parcours</h2>
                            
                          
                            <div className="progress-card">
                                <h3>🎯 Progression globale</h3>
                                <div className="progress-bar-container">
                                    <div className="progress-bar" style={{ width: `${evolutionData.totalTests > 0 ? (evolutionData.testsCompleted / evolutionData.totalTests) * 100 : 0}%` }}></div>
                                </div>
                                <div className="progress-details">
                                    <span>✅ {evolutionData.testsCompleted}/{evolutionData.totalTests || 0} tests complétés</span>
                                    <span>📊 Score moyen: {evolutionData.averageScore}/100</span>
                                </div>
                            </div>
                            
                            <div className="last-test-card">
                                <h3>📝 Dernier test réalisé</h3>
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
                                    <button className="view-details-btn" onClick={() => setActiveMenu('history')}>Voir l'historique →</button>
                                )}
                            </div>
                            
                            <div className="quick-actions">
                                <h3>⚡ Actions rapides</h3>
                                <div className="actions-grid">
                                    <button className="action-card" onClick={() => navigate('/tests')}>
                                        <span>📋</span>
                                        <span>Nouveau test</span>
                                    </button>
                                    <button className="action-card" onClick={() => setActiveMenu('reports')}>
                                        <span>📄</span>
                                        <span>Mes rapports</span>
                                    </button>
                                    <button className="action-card" onClick={() => navigate('/bourses')}>
                                        <span>💰</span>
                                        <span>Bourses</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* HISTORIQUE DES TESTS - Affichage en temps réel */}
                    {activeMenu === 'history' && (
                        <div className="history-content">
                            <div className="section-header">
                                <h2>📋 Historique des tests</h2>
                                <button className="new-test-btn" onClick={() => navigate('/tests')}>+ Nouveau test</button>
                            </div>
                            <div className="tests-list">
                                {testHistory.length === 0 ? (
                                    <div className="empty-state">
                                        <p>Aucun test réalisé pour le moment.</p>
                                        <button className="new-test-btn" onClick={() => navigate('/tests')}>Commencer un test</button>
                                    </div>
                                ) : (
                                    testHistory.map(test => (
                                        <div key={test.id} className={`test-card ${test.status === 'pending' ? 'pending' : ''}`}>
                                            <div className="test-card-header">
                                                <div>
                                                    <h4>{test.title}</h4>
                                                    <span className="test-type">{test.type}</span>
                                                </div>
                                                {test.status === 'completed' ? (
                                                    <span className="status-badge completed">✓ Terminé</span>
                                                ) : (
                                                    <span className="status-badge pending">⏳ En attente</span>
                                                )}
                                            </div>
                                            <div className="test-card-body">
                                                <div className="test-meta"><IconCalendar /> {test.date}</div>
                                                {test.status === 'completed' && (
                                                    <div className="test-score-large">
                                                        <span className="score-number">{test.score}</span>
                                                        <span className="score-max">/100</span>
                                                    </div>
                                                )}
                                                {test.code && (
                                                    <div className="test-code">Code RIASEC: <strong>{test.code}</strong></div>
                                                )}
                                            </div>
                                            <div className="test-card-footer">
                                                <button className="btn-resume" onClick={() => handleResumeTest(test)}>
                                                    {test.status === 'completed' ? 'Voir les détails' : 'Reprendre le test'}
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
                                <h2>📄 Mes rapports PDF</h2>
                            </div>
                            <div className="reports-grid">
                                {pdfReports.length === 0 ? (
                                    <div className="empty-state">
                                        <p>Aucun rapport disponible. Passez un test pour générer votre premier rapport.</p>
                                        <button className="new-test-btn" onClick={() => navigate('/tests')}>Commencer un test</button>
                                    </div>
                                ) : (
                                    pdfReports.map(report => (
                                        <div key={report.id} className="report-card">
                                            <div className="report-icon">📄</div>
                                            <div className="report-info">
                                                <h4>{report.title}</h4>
                                                <div className="report-meta">
                                                    <span>📅 {report.date}</span>
                                                    <span>💾 {report.size}</span>
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
                                    <h3>📊 Bilan personnalisé</h3>
                                    <p>Vous avez {pdfReports.length} rapport(s) disponible(s) dans votre espace.</p>
                                    <button className="download-all-btn" onClick={handleDownloadAllReports}>
                                        📦 Télécharger tous les rapports
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* SUIVI ÉVOLUTION */}
                    {activeMenu === 'evolution' && (
                        <div className="evolution-content">
                            <h2>📈 Évolution de vos performances</h2>
                            <div className="chart-card">
                                <h3>Progression des scores</h3>
                                <div className="simple-chart">
                                    {evolutionData.progression.map((item, idx) => (
                                        <div key={idx} className="chart-bar-wrapper">
                                            <div 
                                                className="chart-bar" 
                                                style={{ 
                                                    height: item.score ? `${item.score}%` : '0%', 
                                                    backgroundColor: item.score ? '#3347df' : '#e5e7eb' 
                                                }}
                                            >
                                                {item.score && <span className="bar-value">{item.score}</span>}
                                            </div>
                                            <span className="bar-label">{item.month}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-icon">🏆</div>
                                    <div>
                                        <div className="stat-number">{evolutionData.bestScore}</div>
                                        <div className="stat-label">Meilleur score</div>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">📊</div>
                                    <div>
                                        <div className="stat-number">{evolutionData.averageScore}</div>
                                        <div className="stat-label">Moyenne générale</div>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">✅</div>
                                    <div>
                                        <div className="stat-number">{evolutionData.testsCompleted}</div>
                                        <div className="stat-label">Tests complétés</div>
                                    </div>
                                </div>
                            </div>
                            <div className="advice-card">
                                <h3>💡 Conseils personnalisés</h3>
                                <ul>
                                    <li>Votre meilleur domaine est l'axe <strong>Investigateur</strong> avec {evolutionData.bestScore}/100</li>
                                    <li>Nous vous recommandons de passer le test de compétences techniques</li>
                                    <li>Consultez les formations recommandées basées sur votre profil</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* BOURSES ENREGISTRÉES */}
                    {activeMenu === 'scholarships' && (
                        <div className="scholarships-content">
                            <div className="section-header">
                                <h2>💰 Bourses enregistrées</h2>
                            </div>
                            <div className="scholarships-list">
                                {savedScholarships.length === 0 ? (
                                    <div className="empty-state">
                                        <p>Aucune bourse enregistrée pour le moment.</p>
                                        <button className="new-test-btn" onClick={() => navigate('/bourses-aides')}>Explorer les bourses</button>
                                    </div>
                                ) : (
                                    savedScholarships.map(scholarship => (
                                        <div key={scholarship.id} className="scholarship-card">
                                            <div className="scholarship-header">
                                                <h4>{scholarship.title}</h4>
                                                <span className={`scholarship-status ${scholarship.status === 'ouvert' ? 'open' : 'closed'}`}>
                                                    {scholarship.status === 'ouvert' ? '🟢 Ouvert' : '🔴 Fermé'}
                                                </span>
                                            </div>
                                            <div className="scholarship-body">
                                                <p className="scholarship-description">{scholarship.description}</p>
                                                <div className="scholarship-details">
                                                    <span>💰 {scholarship.amount || 'Montant non spécifié'}</span>
                                                    <span>📅 Date limite: {scholarship.deadline || 'Non spécifiée'}</span>
                                                    <span>🏫 {scholarship.country || 'Bénin'}</span>
                                                </div>
                                            </div>
                                            <div className="scholarship-footer">
                                                <button className="btn-view" onClick={() => window.open(scholarship.link, '_blank')}>
                                                    Voir les détails →
                                                </button>
                                                <button className="btn-remove" onClick={() => handleRemoveScholarship(scholarship.id)}>
                                                    🗑️ Retirer
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            {savedScholarships.length > 0 && (
                                <div className="scholarships-summary">
                                    <h3>📊 Résumé</h3>
                                    <p>Vous avez {savedScholarships.length} bourse(s) enregistrée(s).</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* MON PROFIL AVEC ÉDITION */}
                    {activeMenu === 'profile' && (
                        <div className="profile-content">
                            <div className="section-header">
                                <h2>👤 Informations personnelles</h2>
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
                                            <input 
                                                type="text" 
                                                name="name"
                                                value={editFormData.name || ''} 
                                                onChange={handleInputChange}
                                                placeholder="Votre nom complet"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Email *</label>
                                            <input 
                                                type="email" 
                                                name="email"
                                                value={editFormData.email || ''} 
                                                onChange={handleInputChange}
                                                placeholder="votre@email.com"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Téléphone</label>
                                            <input 
                                                type="tel" 
                                                name="phone"
                                                value={editFormData.phone || ''} 
                                                onChange={handleInputChange}
                                                placeholder="+229 XX XX XX XX"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Ville</label>
                                            <input 
                                                type="text" 
                                                name="location"
                                                value={editFormData.location || ''} 
                                                onChange={handleInputChange}
                                                placeholder="Votre ville"
                                            />
                                        </div>
                                       
                                        <div className="profile-actions editing-actions">
                                            <button className="save-profile-btn" onClick={handleSaveProfile}>
                                                 Enregistrer
                                            </button>
                                            <button className="cancel-edit-btn" onClick={handleCancelEdit}>
                                                Annuler
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="form-group">
                                            <label>Nom complet</label>
                                            <input type="text" value={userInfo.name} readOnly disabled />
                                        </div>
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input type="email" value={userInfo.email} readOnly disabled />
                                        </div>
                                        <div className="form-group">
                                            <label>Téléphone</label>
                                            <input type="tel" value={userInfo.phone} readOnly disabled />
                                        </div>
                                        <div className="form-group">
                                            <label>Ville</label>
                                            <input type="text" value={userInfo.location} readOnly disabled />
                                        </div>
                                       
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

// ✅ Fonction globale à appeler APRÈS chaque test complété
export const saveTestResultGlobal = (testResult) => {
    console.log('📤 Sauvegarde globale du test:', testResult);
    
    // Sauvegarde dans sessionStorage pour récupération après redirection
    sessionStorage.setItem('pendingTestResult', JSON.stringify(testResult));
    
    // Dispatch immédiat pour mise à jour si la page est déjà ouverte
    const event = new CustomEvent('newTestResult', { detail: { testResult } });
    window.dispatchEvent(event);
    
    // Alternative : sauvegarde directe dans localStorage
    const storedTests = localStorage.getItem('testHistory');
    let tests = [];
    if (storedTests) {
        try {
            tests = JSON.parse(storedTests);
        } catch(e) {}
    }
    
    const newTest = {
        id: Date.now(),
        title: testResult.title || "Test d'orientation",
        date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
        score: testResult.score,
        type: testResult.type || "RIASEC",
        code: testResult.code || "",
        status: "completed",
        fullReport: testResult.fullReport || {}
    };
    
    tests.unshift(newTest);
    localStorage.setItem('testHistory', JSON.stringify(tests));
    console.log('✅ Test sauvegardé dans localStorage');
};

export const saveScholarship = (scholarship) => {
    const stored = localStorage.getItem('savedScholarships');
    let savedList = [];
    if (stored) {
        try {
            savedList = JSON.parse(stored);
        } catch(e) {}
    }
    
    const exists = savedList.some(s => s.id === scholarship.id);
    if (!exists) {
        const newList = [...savedList, scholarship];
        localStorage.setItem('savedScholarships', JSON.stringify(newList));
        
        const event = new CustomEvent('newScholarshipSaved', { detail: { scholarship } });
        window.dispatchEvent(event);
        return true;
    }
    return false;
};