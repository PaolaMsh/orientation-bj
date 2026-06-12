import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/tests.css';
import api from '../services/api';
import { saveTestResult, savePdfReport } from '../services/testService';

const EmotionSvgs = {
    sad: (
        <svg
            viewBox="0 0 24 24"
            width="32"
            height="32"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
        >
            <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" />
            <circle cx="8" cy="9" r="1" fill="currentColor" />
            <circle cx="16" cy="9" r="1" fill="currentColor" />
            <path d="M8 15 Q12 11 16 15" stroke="currentColor" fill="none" strokeLinecap="round" />
        </svg>
    ),
    neutral: (
        <svg
            viewBox="0 0 24 24"
            width="32"
            height="32"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
        >
            <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" />
            <circle cx="8" cy="9" r="1" fill="currentColor" />
            <circle cx="16" cy="9" r="1" fill="currentColor" />
            <line x1="8" y1="15" x2="16" y2="15" stroke="currentColor" strokeLinecap="round" />
        </svg>
    ),
    happy: (
        <svg
            viewBox="0 0 24 24"
            width="32"
            height="32"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
        >
            <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" />
            <circle cx="8" cy="9" r="1" fill="currentColor" />
            <circle cx="16" cy="9" r="1" fill="currentColor" />
            <path d="M8 14 Q12 18 16 14" stroke="currentColor" fill="none" strokeLinecap="round" />
        </svg>
    ),
};

// Nouveaux SVGs pour les sections de la phase 2
const SectionSvgs = {
    realist: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 17L12 22L20 17M4 12L12 17L20 12M12 2L4 7L12 12L20 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
    ),
    investigator: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M16 16L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    ),
    artistic: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4V20M8 8L16 16M8 16L16 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
    ),
};

const PHASE2_SECTIONS = [
    {
        name: 'OCCUPATIONS',
        label: 'Réaliste',
        icon: SectionSvgs.realist,
        description: 'Travail pratique et technique',
    },
    {
        name: 'APTITUDES',
        label: 'Investigateur',
        icon: SectionSvgs.investigator,
        description: 'Exploration et analyse',
    },
    {
        name: 'PERSONNALITY',
        label: 'Artistique',
        icon: SectionSvgs.artistic,
        description: 'Créativité et expression',
    },
];

const BATCH_SIZE = 6;

const Spinner = ({ size = 40, color = '#6246E5' }) => (
    <div className="spinner-container" style={{ textAlign: 'center', padding: '50px' }}>
        <div
            className="spinner"
            style={{
                width: size,
                height: size,
                border: `3px solid ${color}20`,
                borderTopColor: color,
            }}
        />
    </div>
);

const Loader = () => (
    <div className="loader" style={{ textAlign: 'center', padding: '50px' }}>
        <div className="spinner"></div>
    </div>
);

const ErrorView = ({ message, onRetry }) => (
    <div className="error-container" style={{ textAlign: 'center', padding: '50px' }}>
        <div className="error-message" style={{ color: 'red', marginBottom: '20px' }}>
            <strong>Erreur :</strong> {message}
        </div>
        <button
            onClick={onRetry}
            style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#6246E5',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
            }}
        >
            Réessayer
        </button>
    </div>
);

const EmptyView = ({ onReload }) => (
    <div className="error-container" style={{ textAlign: 'center', padding: '50px' }}>
        <p>Aucune question disponible</p>
        <button onClick={onReload} className="submit-btn">
            Recharger
        </button>
    </div>
);

const ProgressHeader = ({
    currentPhase,
    currentSection,
    completionPercentage,
    draftCount,
    batchSize,
}) => {
    const section =
        currentPhase === 'PHASE2' ? PHASE2_SECTIONS.find((s) => s.name === currentSection) : null;
    return (
        <div className="test-header">
            <div className="logo-section">
                <span className="logos-text">RIASEC Profiler</span>
            </div>
            <div className="progress-section">
                <div className="phase-indicator">
                    <span className="phase-name">
                        {currentPhase === 'PHASE1' ? 'Phase 1 - ' : `Phase 2 - `}
                    </span>
                    <span className="phase-desc">
                        {currentPhase === 'PHASE1'
                            ? 'Evaluation de vos intérêts professionnels'
                            : section?.description || 'Évaluation approfondie'}
                    </span>
                </div>
                <div className="progress-stats">
                    <span>
                        {draftCount}/{batchSize} questions
                    </span>
                    <span>{Math.round(completionPercentage)}%</span>
                </div>
                <div className="progress-bar-container">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${completionPercentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

const QuestionCard = ({ question, value, onAnswer }) => {
    const getOptions = () => {
        if (question.phase === 'PHASE1') {
            return [
                { value: 0, label: 'Oui', emoji: EmotionSvgs.happy },
                { value: 1, label: 'Non', emoji: EmotionSvgs.sad },
            ];
        }

        if (question.section === 'APTITUDES') {
            return [
                { value: 1, label: 'Faible', emoji: EmotionSvgs.sad },
                { value: 2, label: 'Moyen', emoji: EmotionSvgs.neutral },
                { value: 3, label: 'Fort', emoji: EmotionSvgs.happy },
            ];
        }

        return [
            { value: 0, label: 'Oui', emoji: EmotionSvgs.happy },
            { value: 1, label: 'Non', emoji: EmotionSvgs.sad },
        ];
    };

    const options = getOptions();

    return (
        <div className={`question-card ${value !== undefined ? 'answered' : ''}`}>
            <h3 className="question-text">{question.text}</h3>
            {question.subtext && <p className="question-subtext">{question.subtext}</p>}
            <div className="emotion-slider">
                <div className="slider-options">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            className={`emotion-btn ${value === opt.value ? 'active' : ''}`}
                            onClick={() => onAnswer(question.id, opt.value)}
                        >
                            <div className="emotion-svg">{opt.emoji}</div>
                            <span className="emotion-label">{opt.label}</span>
                            {value === opt.value && <span className="check-mark">✓</span>}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const formatQuestions = (data, phase, section) =>
    data.map((q) => {
        const base = {
            id: q.id,
            text: q.text,
            riasecType: q.riasecType,
            subtext: q.subtext || null,
            pointsValue: q.pointsValue || 1,
            phase,
        };
        if (phase === 'PHASE1')
            return {
                ...base,
                minValue: q.minValue || 1,
                maxValue: q.maxValue || 3,
                valueLabels: q.valueLabels || ['Non', { emoji: EmotionSvgs.happy, label: 'Oui' }],
            };
        return {
            ...base,
            section,
            sectionType: q.sectionType,
            minValue: section === 'APTITUDES' ? q.minValue || 1 : (q.minValue ?? 0),
            maxValue: section === 'APTITUDES' ? q.maxValue || 3 : 1,
            valueLabels:
                q.valueLabels ||
                (section === 'APTITUDES'
                    ? [
                          'Faible',
                          { emoji: EmotionSvgs.neutral, label: 'Moyen' },
                          { emoji: EmotionSvgs.happy, label: 'Fort' },
                      ]
                    : ['Oui', 'Non']),
        };
    });

const Test = () => {
    const navigate = useNavigate();

    const [currentPhase, setCurrentPhase] = useState(null);
    const [currentSection, setCurrentSection] = useState(null);
    const [completionPercentage, setCompletionPercentage] = useState(0);
    const [sessionToken, setSessionToken] = useState(null);
    const [assessmentId, setAssessmentId] = useState(null);

    const [currentBatch, setCurrentBatch] = useState([]);
    const [draftAnswers, setDraftAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [loadingBatch, setLoadingBatch] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [phase2SectionsCompleted, setPhase2SectionsCompleted] = useState({});
    
    // Historique des lots avec leurs réponses
    const [batchHistory, setBatchHistory] = useState([]);
    // Stockage des réponses des lots précédents
    const [savedAnswersHistory, setSavedAnswersHistory] = useState([]);
    // Indique si l'utilisateur a utilisé "Page précédente" sur ce lot
    const [hasUsedPrevious, setHasUsedPrevious] = useState(false);

    const initializeSession = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Veuillez vous connecter pour passer le test');
                return null;
            }
            const existingSessionToken = localStorage.getItem('session_token');
            const existingAssessmentId = localStorage.getItem('assessment_id');
            if (existingSessionToken && existingAssessmentId)
                return {
                    sessionToken: existingSessionToken,
                    assessmentId: existingAssessmentId,
                };

            const response = await api.post('/sessions', {
                testVersionId: 1,
                initialAssessmentType: 'FULL',
                depth: 5,
                profile: { startedAt: new Date().toISOString(), mode: 'full' },
            });
            if (response?.data) {
                const newSessionToken = response.data.sessionToken;
                const newAssessmentId = response.data.assessment.id;
                localStorage.setItem('session_token', newSessionToken);
                localStorage.setItem('assessment_id', newAssessmentId);
                return { sessionToken: newSessionToken, assessmentId: newAssessmentId };
            }
            throw new Error("Erreur lors de l'initialisation");
        } catch (err) {
            setError(err.response?.data?.message || "Impossible d'initialiser le test");
            return null;
        }
    }, []);

    const resolveProgress = useCallback(async (token, assessmentIdParam) => {
        try {
            if (!token || token === 'null')
                return {
                    status: 'IN_PROGRESS',
                    currentPhase: 'PHASE1',
                    currentSection: null,
                };
            const progressResponse = await api.get(`/assessments/${assessmentIdParam}/progress`, {
                params: { sessionToken: token },
            });
            const progressData = progressResponse.data;
            setCurrentPhase(progressData.currentPhase);
            setCurrentSection(progressData.currentSection);
            setCompletionPercentage(progressData.completionPercentage || 0);
            return progressData;
        } catch (err) {
            return {
                status: 'IN_PROGRESS',
                currentPhase: 'PHASE1',
                currentSection: null,
            };
        }
    }, []);

    const fetchBatch = useCallback(
        async (phase, section = null, tokenParam = null, assessmentIdParam = null) => {
            setLoadingBatch(true);
            const tokenToUse = tokenParam || sessionToken;
            const assessmentIdToUse = assessmentIdParam || assessmentId;

            try {
                let response;
                if (phase === 'PHASE1') {
                    response = await api.get('/questions/phase1', {
                        params: {
                            sessionToken: tokenToUse,
                            assessmentId: assessmentIdToUse,
                            lang: 'fr',
                            take: BATCH_SIZE,
                        },
                    });
                } else if (phase === 'PHASE2' && section) {
                    response = await api.get('/questions/phase2', {
                        params: {
                            sessionToken: tokenToUse,
                            assessmentId: assessmentIdToUse,
                            section,
                            lang: 'fr',
                            take: BATCH_SIZE,
                        },
                    });
                } else throw new Error('Phase ou section invalide');

                if (response?.data && response.data.length > 0) {
                    const formatted = formatQuestions(response.data, phase, section);
                    setCurrentBatch(formatted);
                    // Ne pas charger les réponses existantes - commencer avec un tableau vide
                    setDraftAnswers({});
                    return true;
                }
                setError('Aucune donnée reçue');
                return false;
            } catch (err) {
                console.error('Fetch batch error:', err);
                setError(err.response?.data?.message || 'Impossible de charger les questions');
                return false;
            } finally {
                setLoadingBatch(false);
            }
        },
        [sessionToken, assessmentId],
    );

    const submitBatch = useCallback(async () => {
        if (Object.keys(draftAnswers).length !== currentBatch.length) {
            const remaining = currentBatch.length - Object.keys(draftAnswers).length;
            alert(`Veuillez répondre à toutes les questions (${remaining} restantes)`);
            return null;
        }
        setSubmitting(true);
        try {
            const endpoint = currentPhase === 'PHASE1' ? '/responses/phase1' : '/responses/phase2';
            const payload =
                currentPhase === 'PHASE2'
                    ? {
                          sessionToken,
                          assessmentId,
                          responses: Object.entries(draftAnswers).map(([questionId, answer]) => ({
                              questionId: Number(questionId),
                              responseValue:
                                  currentSection === 'APTITUDES'
                                      ? Math.min(3, Math.max(1, Number(answer.value)))
                                      : Number(answer.value) === 0
                                        ? 0
                                        : 1,
                          })),
                      }
                    : {
                          sessionToken,
                          assessmentId,
                          responses: Object.entries(draftAnswers).map(([questionId, answer]) => ({
                              questionId: Number(questionId),
                              responseValue: answer.value,
                          })),
                      };
            await api.post(endpoint, payload);
            
            setDraftAnswers({});
            const updatedProgress = await resolveProgress(sessionToken, assessmentId);
            return updatedProgress;
        } catch (err) {
            console.error('Submit error:', err);
            setError(err.response?.data?.message || 'Impossible de soumettre les réponses');
            return null;
        } finally {
            setSubmitting(false);
        }
    }, [
        draftAnswers,
        currentBatch,
        currentPhase,
        currentSection,
        sessionToken,
        assessmentId,
        resolveProgress,
    ]);

    // Fonction pour revenir au lot précédent
    const handlePreviousBatch = useCallback(async () => {
        if (batchHistory.length === 0) {
            const shouldReload = window.confirm("Vous êtes au début du test. Voulez-vous recharger les questions ?");
            if (shouldReload) {
                await fetchBatch(currentPhase, currentSection, sessionToken, assessmentId);
            }
            return;
        }
        
        // Marquer que l'utilisateur a utilisé "Page précédente" sur ce lot
        setHasUsedPrevious(true);
        
        // Récupérer le lot précédent et ses réponses
        const previousBatchData = batchHistory[batchHistory.length - 1];
        const previousAnswers = savedAnswersHistory[savedAnswersHistory.length - 1];
        
        // Retirer de l'historique
        setBatchHistory(prev => prev.slice(0, -1));
        setSavedAnswersHistory(prev => prev.slice(0, -1));
        
        // Restaurer le lot précédent avec ses réponses
        setCurrentBatch(previousBatchData.questions);
        setDraftAnswers(previousAnswers || {});
        
        // Mettre à jour la phase et section courantes
        setCurrentPhase(previousBatchData.phase);
        if (previousBatchData.section) {
            setCurrentSection(previousBatchData.section);
        }
    }, [batchHistory, savedAnswersHistory, currentPhase, currentSection, sessionToken, assessmentId, fetchBatch]);

    // Navigation manuelle vers le lot suivant (utilisé après correction)
    const handleManualNextBatch = useCallback(async () => {
        // Vérifier que toutes les questions sont répond
        if (Object.keys(draftAnswers).length !== currentBatch.length) {
            const remaining = currentBatch.length - Object.keys(draftAnswers).length;
            alert(`Veuillez répondre à toutes les questions avant de continuer (${remaining} restante${remaining > 1 ? 's' : ''})`);
            return;
        }
        
        // Sauvegarder le lot actuel et ses réponses dans l'historique
        setBatchHistory(prev => [...prev, {
            batchId: Date.now(),
            phase: currentPhase,
            section: currentSection,
            questions: [...currentBatch]
        }]);
        setSavedAnswersHistory(prev => [...prev, { ...draftAnswers }]);
        
        const progressData = await submitBatch();
        if (!progressData) return;

        // Réinitialiser le flag après soumission manuelle
        setHasUsedPrevious(false);

        if (progressData.status === 'COMPLETED') {
            handleAssessmentCompletion();
            return;
        }

        const previousPhase = currentPhase;
        const newPhase = progressData.currentPhase;

        if (newPhase === 'PHASE1' && previousPhase === 'PHASE1') {
            const success = await fetchBatch('PHASE1', null, sessionToken, assessmentId);
            if (!success) setError('Impossible de charger la prochaine batch');
        } else if (newPhase === 'PHASE2' && previousPhase === 'PHASE1') {
            setCurrentPhase('PHASE2');
            setCurrentSection(PHASE2_SECTIONS[0].name);
            const success = await fetchBatch(
                'PHASE2',
                PHASE2_SECTIONS[0].name,
                sessionToken,
                assessmentId,
            );
            if (!success) setError('Impossible de charger la Phase 2');
        } else if (newPhase === 'PHASE2' && previousPhase === 'PHASE2') {
            if (progressData.currentSection !== currentSection) {
                setPhase2SectionsCompleted((p) => ({ ...p, [currentSection]: true }));
                setCurrentSection(progressData.currentSection);
                const success = await fetchBatch(
                    'PHASE2',
                    progressData.currentSection,
                    sessionToken,
                    assessmentId,
                );
                if (!success) setError('Impossible de charger la prochaine section');
            } else {
                const success = await fetchBatch(
                    'PHASE2',
                    currentSection,
                    sessionToken,
                    assessmentId,
                );
                if (!success) setError('Impossible de charger la prochaine batch');
            }
        }
    }, [currentPhase, currentSection, fetchBatch, submitBatch, sessionToken, assessmentId, currentBatch, draftAnswers]);

    const handleAssessmentCompletion = useCallback(async () => {
        try {
            console.log('📤 Envoi des résultats au serveur...');
            await api.post('/results/compute', { sessionToken, assessmentId });

            console.log('✅ Résultats calculés avec succès');
            console.log('🆔 AssessmentId:', assessmentId);

            localStorage.setItem('assessment_id', assessmentId);

            console.log('🔀 Redirection vers /orientations');
            navigate('/orientations');
        } catch (err) {
            console.error('❌ Erreur finalisation:', err);
            if (err.response?.status === 400) {
                localStorage.setItem('assessment_id', assessmentId);
                navigate('/orientations');
            } else {
                setError('Impossible de finaliser le test');
            }
        }
    }, [sessionToken, assessmentId, navigate]);

    useEffect(() => {
        const loadAssessment = async () => {
            setLoading(true);
            setError(null);
            try {
                const sessionData = await initializeSession();
                if (!sessionData) {
                    setLoading(false);
                    return;
                }
                setSessionToken(sessionData.sessionToken);
                setAssessmentId(sessionData.assessmentId);
                const progressData = await resolveProgress(
                    sessionData.sessionToken,
                    sessionData.assessmentId,
                );
                if (progressData.status === 'COMPLETED') {
                    console.log("⚠️ Test déjà terminé, création d'un nouveau...");

                    localStorage.removeItem('session_token');
                    localStorage.removeItem('assessment_id');

                    const newSession = await initializeSession();
                    if (newSession) {
                        setSessionToken(newSession.sessionToken);
                        setAssessmentId(newSession.assessmentId);

                        const newProgress = await resolveProgress(
                            newSession.sessionToken,
                            newSession.assessmentId,
                        );

                        const phase = newProgress.currentPhase || 'PHASE1';
                        const section =
                            newProgress.currentSection ||
                            (phase === 'PHASE2' ? PHASE2_SECTIONS[0].name : null);

                        await fetchBatch(
                            phase,
                            section,
                            newSession.sessionToken,
                            newSession.assessmentId,
                        );
                        setLoading(false);
                        return;
                    }
                }

                const phase = progressData.currentPhase || 'PHASE1';
                const section =
                    progressData.currentSection ||
                    (phase === 'PHASE2' ? PHASE2_SECTIONS[0].name : null);
                await fetchBatch(
                    phase,
                    section,
                    sessionData.sessionToken,
                    sessionData.assessmentId,
                );
            } catch (err) {
                console.error('Load assessment error:', err);
                setError(err.message || "Impossible de charger l'évaluation");
            } finally {
                setLoading(false);
            }
        };
        loadAssessment();
    }, [initializeSession, resolveProgress, fetchBatch, navigate]);

    const handleAnswer = useCallback((questionId, value) => {
        setDraftAnswers((prev) => ({ ...prev, [questionId]: { value } }));
    }, []);

    const allAnswered =
        currentBatch.length > 0 && Object.keys(draftAnswers).length === currentBatch.length;

    // Auto-submit uniquement quand :
    // 1. Toutes les questions sont répondues
    // 2. On n'est pas en train de soumettre
    // 3. Le lot n'est pas en cours de chargement
    // 4. L'utilisateur n'a PAS utilisé "Page précédente" sur ce lot
    useEffect(() => {
        if (allAnswered && !submitting && !loadingBatch && currentBatch.length > 0 && !hasUsedPrevious) {
            const timer = setTimeout(() => {
                handleManualNextBatch();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [allAnswered, submitting, loadingBatch, currentBatch.length, hasUsedPrevious, handleManualNextBatch]);

    if (loading)
        return (
            <div className="test-page">
                <div className="test-container">
                    <Loader />
                </div>
            </div>
        );

    if (error)
        return (
            <div className="test-page">
                <div className="test-container">
                    <ErrorView message={error} onRetry={() => window.location.reload()} />
                </div>
            </div>
        );

    if (currentBatch.length === 0)
        return (
            <div className="test-page">
                <div className="test-container">
                    <EmptyView onReload={() => window.location.reload()} />
                </div>
            </div>
        );

    return (
        <div className="test-page">
            <div className="test-container">
                <ProgressHeader
                    currentPhase={currentPhase}
                    currentSection={currentSection}
                    completionPercentage={completionPercentage}
                    draftCount={Object.keys(draftAnswers).length}
                    batchSize={currentBatch.length}
                />

                {currentPhase === 'PHASE2' && (
                    <div className="phase2-sections-indicator">
                        {PHASE2_SECTIONS.map((section) => (
                            <div
                                key={section.name}
                                className={`section-badge ${section.name === currentSection ? 'active' : ''} ${phase2SectionsCompleted[section.name] ? 'completed' : ''}`}
                            >
                                <div className="sec">
                                    <span className="section-icon">{section.icon}</span>
                                    <span className="section-name">{section.label}</span>
                                    {phase2SectionsCompleted[section.name] && (
                                        <span className="section-check">✓</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {loadingBatch ? (
                    <Spinner size={30} />
                ) : (
                    <>
                        <div className="questions-grid">
                            {currentBatch.map((q) => (
                                <QuestionCard
                                    key={q.id}
                                    question={q}
                                    value={draftAnswers[q.id]?.value}
                                    onAnswer={handleAnswer}
                                />
                            ))}
                        </div>
                        
                        {/* Section des boutons de navigation */}
                        <div className="pagination-nav" style={{ display: 'flex', gap: '15px', justifyContent: 'space-between' }}>
                            <button
                                className="page-nav-btn prev-btn"
                                onClick={handlePreviousBatch}
                                disabled={submitting || loadingBatch || batchHistory.length === 0}
                                style={{
                                    flex: 1,
                                    backgroundColor: '#f0f0f0',
                                    color: '#333',
                                    border: '1px solid #ddd'
                                }}
                            >
                                ← Page précédente
                            </button>
                            <button
                                className="page-nav-btn next-btn"
                                onClick={handleManualNextBatch}
                                disabled={!allAnswered || submitting || loadingBatch}
                                style={{ flex: 1 }}
                            >
                                {submitting
                                    ? 'Envoi...'
                                    : allAnswered
                                      ? 'Continuer →'
                                      : `Page suivante (${currentBatch.length - Object.keys(draftAnswers).length} restante${currentBatch.length - Object.keys(draftAnswers).length > 1 ? 's' : ''}) →`}
                            </button>
                        </div>
                        
                        {/* Message d'information pour l'auto-défilement */}
                        {!hasUsedPrevious && allAnswered && !submitting && (
                            <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px', color: '#666' }}>
                            
                            </div>
                        )}
                        {hasUsedPrevious && (
                            <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px', color: '#ff9800' }}>
                                Cliquez sur "Continuer" pour valider vos modifications
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Test;