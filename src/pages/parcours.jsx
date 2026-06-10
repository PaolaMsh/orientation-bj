import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/parcours.css';
import { jsPDF } from 'jspdf';

// ============ ICONES SVG ============

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

const IconTarget = () => (
    <svg
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
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

const IconLightbulb = () => (
    <svg
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path d="M9.5 19.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-1.5h-5z" />
        <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6v3h8v-3c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" />
        <line x1="9" y1="16" x2="15" y2="16" />
    </svg>
);

const IconClipboard = () => (
    <svg
        width="18"
        height="18"
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

const IconPackage = () => (
    <svg
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.29 7 12 12 20.71 7" />
        <line x1="12" y1="22" x2="12" y2="12" />
    </svg>
);

const IconHelpCircle = () => (
    <svg
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);

const IconMail = () => (
    <svg
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <polyline points="22 7 12 13 2 7" />
    </svg>
);

const IconTrash = () => (
    <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <polyline points="3 6 5 6 21 6" />
        <path d="M8 6V4h8v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);

const IconCode = () => (
    <svg
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
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
    <svg
        width="16"
        height="16"
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

const IconPlus = () => (
    <svg
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const IconArrowRight = () => (
    <svg
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

const IconBuilding = () => (
    <svg
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
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
        const avgScore =
            completedCount > 0
                ? Math.round(completedTests.reduce((sum, t) => sum + t.score, 0) / completedCount)
                : 0;
        const bestScore = completedCount > 0 ? Math.max(...completedTests.map((t) => t.score)) : 0;

        const months = [
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
        const currentMonthIndex = new Date().getMonth();
        const lastThreeMonths = months.slice(
            Math.max(0, currentMonthIndex - 2),
            currentMonthIndex + 1,
        );

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

    const saveTestResult = useCallback(
        (testResult) => {
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
        },
        [updateEvolutionData],
    );

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

    // Générer un PDF complet
    const generatePDF = (report, isDownload = true) => {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const primaryColor = [51, 71, 223];
        const textColor = [55, 65, 81];

        let yPosition = 20;

        // En-tête
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(0, 0, 210, 50, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text(" Mon rapport d'orientation RIASEC", 20, 28);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Test effectué le: ${report.date}`, 20, 42);
        yPosition = 65;

        const content = report.content || {};
        const scores = content.scores || {};
        const code = content.code || '';
        const recommendations = content.recommendations || {};
        const behavioral = content.behavioral || {};
        const assessmentInfo = content.assessmentInfo || {};

        // Code RIASEC
        if (code) {
            doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.roundedRect(20, yPosition - 5, 60, 10, 5, 5, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text(`Code RIASEC: ${code}`, 25, yPosition + 2);
            yPosition += 15;
        }

        // === SECTION 1: Résumé du test ===
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('1. Résumé du test', 20, yPosition);
        yPosition += 8;

        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(
            "Test d'intérêts professionnels et de personnalité basé sur la typologie de Holland (RIASEC).",
            20,
            yPosition,
        );
        yPosition += 6;
        doc.text(
            'Objectif : identifier vos affinités naturelles pour guider vos choix de formation et métier.',
            20,
            yPosition,
        );
        yPosition += 10;

        doc.setFont('helvetica', 'bold');
        doc.text('Statut:', 20, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(assessmentInfo.status || 'COMPLETED', 55, yPosition);
        yPosition += 6;

        doc.setFont('helvetica', 'bold');
        doc.text('Cohérence des réponses:', 20, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(assessmentInfo.coherence || 'Élevée', 65, yPosition);
        yPosition += 12;

        // Axes dominants
        const axesNames = {
            REALISTIC: 'Réaliste',
            INVESTIGATIVE: 'Investigateur',
            ARTISTIC: 'Artistique',
            SOCIAL: 'Social',
            ENTERPRISING: 'Entreprenant',
            CONVENTIONAL: 'Conventionnel',
        };
        const dominantAxes = Object.entries(scores)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);
        const dominantText = dominantAxes
            .map(([key, val]) => `${axesNames[key]}: ${val}/100`)
            .join(' & ');

        doc.setFont('helvetica', 'bold');
        doc.text('Axes dominants détectés:', 20, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(dominantText, 20, yPosition + 6);
        yPosition += 18;

        // Scores détaillés
        doc.setFont('helvetica', 'bold');
        doc.text('Scores détaillés:', 20, yPosition);
        yPosition += 6;
        doc.setFont('helvetica', 'normal');

        const axesList = [
            { name: 'Réaliste', value: scores.REALISTIC || 0 },
            { name: 'Investigateur', value: scores.INVESTIGATIVE || 0 },
            { name: 'Artistique', value: scores.ARTISTIC || 0 },
            { name: 'Social', value: scores.SOCIAL || 0 },
            { name: 'Entreprenant', value: scores.ENTERPRISING || 0 },
            { name: 'Conventionnel', value: scores.CONVENTIONAL || 0 },
        ];

        axesList.forEach((axis) => {
            doc.text(`${axis.name}: ${axis.value}/100`, 25, yPosition);
            yPosition += 5;
        });
        yPosition += 5;

        // === SECTION 2: Points forts et axes d'amélioration ===
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('2. Détail & observations', 20, yPosition);
        yPosition += 8;

        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Points forts identifiés', 20, yPosition);
        yPosition += 6;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        if (behavioral.pointsForts && behavioral.pointsForts.length > 0) {
            behavioral.pointsForts.forEach((point, idx) => {
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }
                doc.setFont('helvetica', 'bold');
                doc.text(`${point.title}:`, 25, yPosition);
                doc.setFont('helvetica', 'normal');
                const desc =
                    point.description.length > 80
                        ? point.description.substring(0, 77) + '...'
                        : point.description;
                doc.text(desc, 25, yPosition + 5);
                yPosition += 12;
            });
        } else {
            doc.text(
                'Curiosité intellectuelle: Vous aimez résoudre des problèmes complexes.',
                25,
                yPosition,
            );
            yPosition += 6;
            doc.text("Pragmatisme: Capacité à passer à l'action.", 25, yPosition);
            yPosition += 10;
        }

        doc.setFont('helvetica', 'bold');
        doc.text("Axes d'amélioration", 20, yPosition);
        yPosition += 6;
        doc.setFont('helvetica', 'normal');

        if (behavioral.axesAmelioration && behavioral.axesAmelioration.length > 0) {
            behavioral.axesAmelioration.forEach((axe, idx) => {
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }
                doc.setFont('helvetica', 'bold');
                doc.text(`${axe.title}:`, 25, yPosition);
                doc.setFont('helvetica', 'normal');
                const desc =
                    axe.description.length > 80
                        ? axe.description.substring(0, 77) + '...'
                        : axe.description;
                doc.text(desc, 25, yPosition + 5);
                yPosition += 12;
            });
        } else {
            doc.text('Travail collaboratif: Développer la collaboration en équipe.', 25, yPosition);
            yPosition += 10;
        }
        yPosition += 5;

        // === SECTION 3: Recommandations ===
        if (recommendations && Object.keys(recommendations).length > 0) {
            if (yPosition > 250) {
                doc.addPage();
                yPosition = 20;
            }

            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('3. Formations & métiers recommandés', 20, yPosition);
            yPosition += 10;

            doc.setTextColor(textColor[0], textColor[1], textColor[2]);

            // Métiers
            if (recommendations.careers && recommendations.careers.length > 0) {
                doc.setFont('helvetica', 'bold');
                doc.text('Métiers recommandés:', 20, yPosition);
                yPosition += 6;
                doc.setFont('helvetica', 'normal');
                recommendations.careers.slice(0, 15).forEach((career) => {
                    if (yPosition > 270) {
                        doc.addPage();
                        yPosition = 20;
                    }
                    doc.text(`• ${career}`, 25, yPosition);
                    yPosition += 5;
                });
                yPosition += 5;
            }

            // Formations
            if (recommendations.formations && recommendations.formations.length > 0) {
                if (yPosition > 260) {
                    doc.addPage();
                    yPosition = 20;
                }
                doc.setFont('helvetica', 'bold');
                doc.text('Formations recommandées:', 20, yPosition);
                yPosition += 6;
                doc.setFont('helvetica', 'normal');
                recommendations.formations.slice(0, 15).forEach((formation) => {
                    if (yPosition > 270) {
                        doc.addPage();
                        yPosition = 20;
                    }
                    doc.text(`• ${formation}`, 25, yPosition);
                    yPosition += 5;
                });
                yPosition += 5;
            }

            // Écoles
            const ecoles = [];
            if (recommendations.recommendationsByAxis) {
                Object.values(recommendations.recommendationsByAxis).forEach((reco) => {
                    if (reco.ecoles && reco.ecoles.length > 0) {
                        ecoles.push(...reco.ecoles);
                    }
                });
            }

            if (ecoles.length > 0) {
                if (yPosition > 260) {
                    doc.addPage();
                    yPosition = 20;
                }
                doc.setFont('helvetica', 'bold');
                doc.text('Écoles / Centres de formation:', 20, yPosition);
                yPosition += 6;
                doc.setFont('helvetica', 'normal');
                const uniqueEcoles = [...new Set(ecoles)].slice(0, 10);
                uniqueEcoles.forEach((ecole) => {
                    if (yPosition > 270) {
                        doc.addPage();
                        yPosition = 20;
                    }
                    doc.text(`• ${ecole}`, 25, yPosition);
                    yPosition += 5;
                });
            }
        }

        // Pied de page
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(156, 163, 175);
            doc.text(`Rapport d'orientation - Page ${i} sur ${pageCount}`, 105, 287, {
                align: 'center',
            });
        }

        if (isDownload) {
            doc.save(`${report.title.replace(/\s/g, '_')}.pdf`);
        } else {
            const blob = doc.output('blob');
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
            setTimeout(() => URL.revokeObjectURL(url), 100);
        }
    };

    const handleViewReport = (report) => {
        generatePDF(report, false);
    };

    const handleDownloadReport = (report) => {
        generatePDF(report, true);
    };

    const handleDownloadAllReports = () => {
        if (pdfReports.length === 0) {
            alert('Aucun rapport à télécharger.');
            return;
        }

        pdfReports.forEach((report, index) => {
            setTimeout(() => {
                generatePDF(report, true);
            }, index * 1000);
        });

        alert(`Téléchargement de ${pdfReports.length} rapport(s) en cours...`);
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

        const handleNewTest = (event) => {
            if (event.detail && event.detail.testResult) {
                loadTestHistory();
                loadPdfReports();
            }
        };

        const handleNewReport = (event) => {
            if (event.detail && event.detail.report) {
                loadPdfReports();
            }
        };

        const handleNewScholarship = (event) => {
            if (event.detail && event.detail.scholarship) {
                loadSavedScholarships();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('newTestResult', handleNewTest);
        window.addEventListener('newReportSaved', handleNewReport);
        window.addEventListener('newScholarshipSaved', handleNewScholarship);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('newTestResult', handleNewTest);
            window.removeEventListener('newReportSaved', handleNewReport);
            window.removeEventListener('newScholarshipSaved', handleNewScholarship);
        };
    }, []);

    const menuItems = [
        { id: 'dashboard', label: 'Tableau de bord', icon: <IconDashboard /> },
        { id: 'history', label: 'Historique des tests', icon: <IconHistory /> },
        { id: 'reports', label: 'Rapports ', icon: <IconFile /> },
        { id: 'evolution', label: 'Suivi évolution', icon: <IconTrendUp /> },
        { id: 'scholarships', label: 'Bourses enregistrées', icon: <IconScholarship /> },
        { id: 'profile', label: 'Mon profil', icon: <IconUser /> },
    ];

    const lastTest = testHistory.filter((t) => t.status === 'completed')[0];

    return (
        <div className="espace-container">
            <div className="espace-header">
                <div className="espace-header-content">
                    <h1>
                        <IconUser /> Espace personnel
                    </h1>
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
                                ? Math.round(
                                      (evolutionData.testsCompleted / evolutionData.totalTests) *
                                          100,
                                  )
                                : 0}
                            %
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
                            <h2>
                                <IconDashboard /> Aperçu de votre parcours
                            </h2>

                            <div className="progress-card">
                                <h3> Progression globale</h3>
                                <div className="progress-bar-container">
                                    <div
                                        className="progress-bar"
                                        style={{
                                            width: `${evolutionData.totalTests > 0 ? (evolutionData.testsCompleted / evolutionData.totalTests) * 100 : 0}%`,
                                        }}
                                    ></div>
                                </div>
                                <div className="progress-details">
                                    <span>
                                        <IconCheck /> {evolutionData.testsCompleted}/
                                        {evolutionData.totalTests || 0} tests complétés
                                    </span>
                                    <span>
                                        <IconChart /> Score moyen: {evolutionData.averageScore}/100
                                    </span>
                                </div>
                            </div>

                            <div className="last-test-card">
                                <h3> Dernier test réalisé</h3>
                                {lastTest ? (
                                    <div className="test-result">
                                        <div className="test-info">
                                            <strong>{lastTest.title}</strong>
                                            <span className="test-date">
                                                <IconCalendar /> {lastTest.date}
                                            </span>
                                        </div>
                                        <div className="test-score-badge">{lastTest.score}/100</div>
                                        {lastTest.code && (
                                            <div className="test-code-badge">
                                                Code: {lastTest.code}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="no-test-message">
                                        <p>Aucun test réalisé pour le moment.</p>
                                    </div>
                                )}
                                {lastTest && (
                                    <button
                                        className="view-details-btn"
                                        onClick={() => setActiveMenu('history')}
                                    >
                                        Voir l'historique <IconArrowRight />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* HISTORIQUE DES TESTS */}
                    {activeMenu === 'history' && (
                        <div className="history-content">
                            <div className="section-header">
                                <h2>
                                    <IconHistory /> Historique des tests
                                </h2>
                                <button className="new-test-btn" onClick={() => navigate('/tests')}>
                                    <IconPlus /> Nouveau test
                                </button>
                            </div>
                            <div className="tests-list">
                                {testHistory.length === 0 ? (
                                    <div className="empty-state">
                                        <p>Aucun test réalisé pour le moment.</p>
                                        <button
                                            className="new-test-btn"
                                            onClick={() => navigate('/tests')}
                                        >
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
                                                <div className="test-meta">
                                                    <IconCalendar /> {test.date}
                                                </div>
                                                <div className="test-score-large">
                                                    <span className="score-number">
                                                        {test.score}
                                                    </span>
                                                    <span className="score-max">/100</span>
                                                </div>
                                                {test.code && (
                                                    <div className="test-code">
                                                        Code RIASEC: <strong>{test.code}</strong>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="test-card-footer">
                                                <button
                                                    className="btn-resume"
                                                    onClick={() => handleResumeTest(test)}
                                                >
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
                                <h2>
                                    <IconFile /> Mes rapports PDF
                                </h2>
                            </div>
                            <div className="reports-grid">
                                {pdfReports.length === 0 ? (
                                    <div className="empty-state">
                                        <p>
                                            Aucun rapport disponible. Passez un test pour générer
                                            votre premier rapport.
                                        </p>
                                        <button
                                            className="new-test-btn"
                                            onClick={() => navigate('/tests')}
                                        >
                                            Commencer un test
                                        </button>
                                    </div>
                                ) : (
                                    pdfReports.map((report) => (
                                        <div key={report.id} className="report-card">
                                            <div className="report-icon">
                                                <IconFile />
                                            </div>
                                            <div className="report-info">
                                                <h4>{report.title}</h4>
                                                <div className="report-meta">
                                                    <span>
                                                        <IconCalendar /> {report.date}
                                                    </span>
                                                    <span>
                                                        <IconDownload /> {report.size}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="report-actions">
                                                <button
                                                    className="action-icon"
                                                    onClick={() => handleViewReport(report)}
                                                    title="Voir"
                                                >
                                                    <IconEye />
                                                </button>
                                                <button
                                                    className="action-icon"
                                                    onClick={() => handleDownloadReport(report)}
                                                    title="Télécharger"
                                                >
                                                    <IconDownload />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            {pdfReports.length > 0 && (
                                <div className="reports-summary">
                                    <h3>
                                        <IconChart /> Bilan personnalisé
                                    </h3>
                                    <p>
                                        Vous avez {pdfReports.length} rapport(s) disponible(s) dans
                                        votre espace.
                                    </p>
                                    <button
                                        className="download-all-btn"
                                        onClick={handleDownloadAllReports}
                                    >
                                        <IconPackage /> Télécharger tous les rapports
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* SUIVI ÉVOLUTION */}
                    {activeMenu === 'evolution' && (
                        <div className="evolution-content">
                            <h2>
                                <IconTrendUp /> Évolution de vos performances
                            </h2>
                            <div className="chart-card">
                                <h3>Progression des scores</h3>
                                <div className="simple-chart">
                                    {evolutionData.progression.map((item, idx) => (
                                        <div key={idx} className="chart-bar-wrapper">
                                            <div
                                                className="chart-bar"
                                                style={{
                                                    height: item.score ? `${item.score}%` : '0%',
                                                    backgroundColor: item.score
                                                        ? '#3347df'
                                                        : '#e5e7eb',
                                                }}
                                            >
                                                {item.score && (
                                                    <span className="bar-value">{item.score}</span>
                                                )}
                                            </div>
                                            <span className="bar-label">{item.month}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-icon">
                                        <IconTrophy />
                                    </div>
                                    <div>
                                        <div className="stat-number">{evolutionData.bestScore}</div>
                                        <div className="stat-label">Meilleur score</div>
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
                                        <div className="stat-label">Moyenne générale</div>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">
                                        <IconCheck />
                                    </div>
                                    <div>
                                        <div className="stat-number">
                                            {evolutionData.testsCompleted}
                                        </div>
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
                                <h2>
                                    <IconScholarship /> Bourses enregistrées
                                </h2>
                            </div>
                            <div className="scholarships-list">
                                {savedScholarships.length === 0 ? (
                                    <div className="empty-state">
                                        <p>Aucune bourse enregistrée pour le moment.</p>
                                        <button
                                            className="new-test-btn"
                                            onClick={() => navigate('/bourses-aides')}
                                        >
                                            Explorer les bourses
                                        </button>
                                    </div>
                                ) : (
                                    savedScholarships.map((scholarship) => (
                                        <div key={scholarship.id} className="scholarship-card">
                                            <div className="scholarship-header">
                                                <h4>{scholarship.title}</h4>
                                                <span
                                                    className={`scholarship-status ${scholarship.status === 'ouvert' ? 'open' : 'closed'}`}
                                                >
                                                    {scholarship.status === 'ouvert' ? (
                                                        <IconOpen />
                                                    ) : (
                                                        <IconClosed />
                                                    )}
                                                    {scholarship.status === 'ouvert'
                                                        ? 'Ouvert'
                                                        : 'Fermé'}
                                                </span>
                                            </div>
                                            <div className="scholarship-body">
                                                <p className="scholarship-description">
                                                    {scholarship.description}
                                                </p>
                                                <div className="scholarship-details">
                                                    <span>
                                                        <IconScholarship />{' '}
                                                        {scholarship.amount ||
                                                            'Montant non spécifié'}
                                                    </span>
                                                    <span>
                                                        <IconCalendar />{' '}
                                                        {scholarship.deadline || 'Non spécifiée'}
                                                    </span>
                                                    <span>
                                                        <IconBuilding />{' '}
                                                        {scholarship.country || 'Bénin'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="scholarship-footer">
                                                <button
                                                    className="btn-view"
                                                    onClick={() =>
                                                        window.open(scholarship.link, '_blank')
                                                    }
                                                >
                                                    Voir les détails
                                                </button>
                                                <button
                                                    className="btn-remove"
                                                    onClick={() =>
                                                        handleRemoveScholarship(scholarship.id)
                                                    }
                                                >
                                                    Retirer
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            {savedScholarships.length > 0 && (
                                <div className="scholarships-summary">
                                    <h3>
                                        <IconChart /> Résumé
                                    </h3>
                                    <p>
                                        Vous avez {savedScholarships.length} bourse(s)
                                        enregistrée(s).
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* MON PROFIL */}
                    {activeMenu === 'profile' && (
                        <div className="profile-content">
                            <div className="section-header">
                                <h2>
                                    <IconUser /> Informations personnelles
                                </h2>
                                {!isEditingProfile && (
                                    <button
                                        className="edit-profile-btn"
                                        onClick={handleEditProfile}
                                    >
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
                                            <button
                                                className="save-profile-btn"
                                                onClick={handleSaveProfile}
                                            >
                                                Enregistrer
                                            </button>
                                            <button
                                                className="cancel-edit-btn"
                                                onClick={handleCancelEdit}
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="form-group">
                                            <label>Nom complet</label>
                                            <input
                                                type="text"
                                                value={userInfo.name}
                                                readOnly
                                                disabled
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input
                                                type="email"
                                                value={userInfo.email}
                                                readOnly
                                                disabled
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Téléphone</label>
                                            <input
                                                type="tel"
                                                value={userInfo.phone}
                                                readOnly
                                                disabled
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Ville</label>
                                            <input
                                                type="text"
                                                value={userInfo.location}
                                                readOnly
                                                disabled
                                            />
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

export const saveTestResultGlobal = (testResult) => {
    sessionStorage.setItem('pendingTestResult', JSON.stringify(testResult));
    window.dispatchEvent(new CustomEvent('newTestResult', { detail: { testResult } }));

    const storedTests = localStorage.getItem('testHistory');
    let tests = storedTests ? JSON.parse(storedTests) : [];

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
