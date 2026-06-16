import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/tests.css';
import api from '../services/api';

// Émotions
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

const BATCH_SIZE = 6;

const Spinner = ({ size = 40 }) => (
    <div className="spinner-container" style={{ textAlign: 'center', padding: '50px' }}>
        <div className="spinner" style={{ width: size, height: size }}></div>
    </div>
);

const ProgressHeader = ({
    completionPercentage,
    draftCount,
    batchSize,
}) => {
    return (
        <div className="test-header">
            <div className="logo-section">
                <span className="logos-text">RIASEC Profiler</span>
            </div>
            <div className="progress-section">
                <div className="phase-indicator">
                    <span className="phase-name">Phase 1 - Intérêts</span>
                    <span className="phase-desc">Évaluation de vos intérêts professionnels</span>
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
    const options = [
        { value: 0, label: 'Non', emoji: EmotionSvgs.sad },
        { value: 1, label: 'Oui', emoji: EmotionSvgs.happy },
    ];

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

const formatQuestions = (data) => {
    return data.map((q) => ({
        id: q.id,
        text: q.text,
        subtext: q.subtext || null,
        phase: 'PHASE1',
        riasecType: q.riasecType,
    }));
};

const PhaseTest = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const phaseId = parseInt(id, 10);

    // ✅ UNIQUEMENT PHASE 1
    if (phaseId !== 1) {
        return (
            <div className="test-page">
                <div className="test-container">
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <h2>Phase non disponible</h2>
                        <p>Seule la Phase 1 est disponible.</p>
                        <button 
                            className="btn-primary" 
                            onClick={() => navigate('/tests-orientations')}
                        >
                            Retour
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const [sessionToken, setSessionToken] = useState(null);
    const [assessmentId, setAssessmentId] = useState(null);
    const [completionPercentage, setCompletionPercentage] = useState(0);
    const [currentBatch, setCurrentBatch] = useState([]);
    const [draftAnswers, setDraftAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingBatch, setLoadingBatch] = useState(true);
    const [error, setError] = useState(null);
    const [phaseCompleted, setPhaseCompleted] = useState(false);
    const [phaseResults, setPhaseResults] = useState(null);

    const resolveProgress = useCallback(async (token, assessmentIdParam) => {
        try {
            const progressResponse = await api.get(`/assessments/${assessmentIdParam}/progress`, {
                params: { sessionToken: token },
            });
            const progressData = progressResponse.data;
            setCompletionPercentage(progressData.completionPercentage || 0);
            return progressData;
        } catch (err) {
            return { status: 'IN_PROGRESS' };
        }
    }, []);

    const initializeSession = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Veuillez vous connecter pour passer le test');
                return null;
            }

            const existingSessionToken = localStorage.getItem('phase_1_session_token');
            const existingAssessmentId = localStorage.getItem('phase_1_assessment_id');

            if (existingSessionToken && existingAssessmentId && !phaseCompleted) {
                return { sessionToken: existingSessionToken, assessmentId: existingAssessmentId };
            }

            const response = await api.post('/sessions', {
                testVersionId: 1,
                initialAssessmentType: 'PHASE1',
                depth: 5,
                profile: {
                    startedAt: new Date().toISOString(),
                    mode: 'phase',
                    phaseId: 1,
                    isSimplePhase: true,
                },
            });

            if (response?.data) {
                const newSessionToken = response.data.sessionToken;
                const newAssessmentId = response.data.assessment.id;
                localStorage.setItem('phase_1_session_token', newSessionToken);
                localStorage.setItem('phase_1_assessment_id', newAssessmentId);
                return { sessionToken: newSessionToken, assessmentId: newAssessmentId };
            }
            throw new Error("Erreur lors de l'initialisation");
        } catch (err) {
            console.error('Session error:', err);
            setError(err.response?.data?.message || "Impossible d'initialiser le test");
            return null;
        }
    }, [phaseCompleted]);

    const fetchBatch = useCallback(
        async (tokenParam = null, assessmentIdParam = null) => {
            setLoadingBatch(true);
            const tokenToUse = tokenParam || sessionToken;
            const assessmentIdToUse = assessmentIdParam || assessmentId;

            try {
                const response = await api.get('/questions/phase1', {
                    params: {
                        sessionToken: tokenToUse,
                        assessmentId: assessmentIdToUse,
                        lang: 'fr',
                        take: BATCH_SIZE,
                    },
                });

                if (response?.data && response.data.length > 0) {
                    const formatted = formatQuestions(response.data);
                    setCurrentBatch(formatted);
                    setDraftAnswers({});
                    return true;
                }

                await completePhase(tokenToUse, assessmentIdToUse);
                return false;
            } catch (err) {
                console.error('Fetch batch error:', err);
                const message = err.response?.data?.message || err.message || '';
                if (
                    String(message).toLowerCase().includes('aucun test actif') ||
                    String(message).toLowerCase().includes('no active')
                ) {
                    await completePhase(tokenToUse, assessmentIdToUse);
                    return false;
                }
                setError(err.response?.data?.message || 'Impossible de charger les questions');
                return false;
            } finally {
                setLoadingBatch(false);
            }
        },
        [sessionToken, assessmentId],
    );

    const completePhase = async (token, assessmentIdParam) => {
        setSubmitting(true);
        try {
            // Calculer les résultats
            try {
                await api.post('/results/compute', {
                    sessionToken: token,
                    assessmentId: assessmentIdParam,
                });
            } catch (computeErr) {
                console.warn('Compute warning:', computeErr);
            }

            // Récupérer les résultats
            let response;
            try {
                response = await api.get(`/results/by-assessment/${assessmentIdParam}`);
            } catch (resultErr) {
                response = await api.get('/results/phase1', {
                    params: { assessmentId: assessmentIdParam, sessionToken: token },
                });
            }

            // ✅ Phase 1 → rapport Phase 1 (1 lettre)
            localStorage.setItem('assessment_id', String(assessmentIdParam));
            localStorage.setItem('session_token', String(token));
            localStorage.setItem('phase1_report_data', JSON.stringify(response?.data || {}));
            
            localStorage.removeItem('phase_1_session_token');
            localStorage.removeItem('phase_1_assessment_id');
            
            navigate('/rapport-phase1', {
                state: {
                    phaseResults: response?.data,
                    assessmentId: assessmentIdParam,
                    sessionToken: token,
                },
            });
        } catch (err) {
            console.error('Error completing phase:', err);
            setError("Impossible de finaliser la phase et d'afficher le rapport");
        } finally {
            setSubmitting(false);
        }
    };

    const submitBatch = useCallback(async () => {
        if (Object.keys(draftAnswers).length !== currentBatch.length) {
            alert(
                `Veuillez répondre à toutes les questions (${currentBatch.length - Object.keys(draftAnswers).length} restantes)`,
            );
            return null;
        }

        setSubmitting(true);
        try {
            const payload = {
                sessionToken,
                assessmentId,
                responses: Object.entries(draftAnswers).map(([questionId, answer]) => ({
                    questionId: Number(questionId),
                    responseValue: answer.value,
                })),
            };

            await api.post('/responses/phase1', payload);
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
    }, [draftAnswers, currentBatch, sessionToken, assessmentId, resolveProgress]);

    const handleBatchComplete = useCallback(async () => {
        const progressData = await submitBatch();
        if (!progressData) return;

        if (progressData.status === 'COMPLETED') {
            await completePhase(sessionToken, assessmentId);
            return;
        }

        await fetchBatch(sessionToken, assessmentId);
    }, [submitBatch, fetchBatch, sessionToken, assessmentId]);

    const handleAnswer = useCallback((questionId, value) => {
        setDraftAnswers((prev) => ({ ...prev, [questionId]: { value } }));
    }, []);

    useEffect(() => {
        const loadPhase = async () => {
            setLoading(true);
            setError(null);
            const sessionData = await initializeSession();
            if (sessionData) {
                setSessionToken(sessionData.sessionToken);
                setAssessmentId(sessionData.assessmentId);
                await resolveProgress(sessionData.sessionToken, sessionData.assessmentId);
                await fetchBatch(sessionData.sessionToken, sessionData.assessmentId);
            }
            setLoading(false);
        };
        loadPhase();
    }, [initializeSession, fetchBatch, resolveProgress]);

    const allAnswered =
        currentBatch.length > 0 && Object.keys(draftAnswers).length === currentBatch.length;

    useEffect(() => {
        if (
            allAnswered &&
            !submitting &&
            !loadingBatch &&
            !phaseCompleted &&
            currentBatch.length > 0
        ) {
            const timer = setTimeout(() => {
                handleBatchComplete();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [
        allAnswered,
        submitting,
        loadingBatch,
        phaseCompleted,
        currentBatch.length,
        handleBatchComplete,
    ]);

    if (loading) {
        return (
            <div className="test-page">
                <div className="test-container">
                    <Spinner />
                    <p style={{ textAlign: 'center', marginTop: '20px' }}>
                        Chargement de la Phase 1...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="test-page">
                <div className="test-container">
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <p style={{ color: 'red' }}>Erreur : {error}</p>
                        <button onClick={() => window.location.reload()}>Réessayer</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="test-page">
            <div className="test-container">
                <ProgressHeader
                    completionPercentage={completionPercentage}
                    draftCount={Object.keys(draftAnswers).length}
                    batchSize={currentBatch.length}
                />

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
                        <div className="pagination-nav">
                            <button
                                className="page-nav-btn next-btn"
                                onClick={handleBatchComplete}
                                disabled={!allAnswered || submitting || loadingBatch}
                                style={{ width: '100%' }}
                            >
                                {submitting
                                    ? 'Envoi...'
                                    : allAnswered
                                      ? 'Continuer →'
                                      : 'Page suivante →'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PhaseTest;