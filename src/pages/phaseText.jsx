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

const PHASE2_SECTIONS = [
    {
        name: 'OCCUPATIONS',
        label: 'Réaliste',
        icon: '🔧',
        description: 'Travail pratique et technique',
    },
    {
        name: 'APTITUDES',
        label: 'Investigateur',
        icon: '🔬',
        description: 'Exploration et analyse',
    },
    {
        name: 'PERSONALITY',
        label: 'Artistique',
        icon: '🎨',
        description: 'Créativité et expression',
    },
];

const BATCH_SIZE = 6;

const Spinner = ({ size = 40 }) => (
    <div className="spinner-container" style={{ textAlign: 'center', padding: '50px' }}>
        <div className="spinner" style={{ width: size, height: size }}></div>
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
                        {currentPhase === 'PHASE1'
                            ? 'Phase 1 - Intérêts'
                            : `Phase 2 - ${section?.label || currentSection}`}
                    </span>
                    <span className="phase-desc">
                        {currentPhase === 'PHASE1'
                            ? 'Évaluation de vos intérêts professionnels'
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

const QuestionCard = ({ question, value, onAnswer, currentPhase, currentSection }) => {
    const getOptions = () => {
        if (currentPhase === 'PHASE1') {
            return [
                { value: 0, label: 'Non', emoji: EmotionSvgs.sad },
                { value: 1, label: 'Oui', emoji: EmotionSvgs.happy },
            ];
        }
        if (currentSection === 'APTITUDES') {
            return [
                { value: 1, label: 'Faible', emoji: EmotionSvgs.sad },
                { value: 2, label: 'Moyen', emoji: EmotionSvgs.neutral },
                { value: 3, label: 'Fort', emoji: EmotionSvgs.happy },
            ];
        }
        return [
            { value: 0, label: 'Non', emoji: EmotionSvgs.sad },
            { value: 1, label: 'Oui', emoji: EmotionSvgs.happy },
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

const formatQuestions = (data, phase, section) => {
    return data.map((q) => ({
        id: q.id,
        text: q.text,
        subtext: q.subtext || null,
        section: section,
        phase: phase,
        riasecType: q.riasecType,
    }));
};

const PhaseTest = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const phaseId = parseInt(id, 10);

    // Phase 1 = test simple, Phases 2,3,4 = test complet
    const isSimplePhase = phaseId === 1;
    const initialAssessmentType = isSimplePhase ? 'PHASE1' : 'FULL';

    const [sessionToken, setSessionToken] = useState(null);
    const [assessmentId, setAssessmentId] = useState(null);
    const [currentPhase, setCurrentPhase] = useState(null);
    const [currentSection, setCurrentSection] = useState(null);
    const [completionPercentage, setCompletionPercentage] = useState(0);
    const [currentBatch, setCurrentBatch] = useState([]);
    const [draftAnswers, setDraftAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingBatch, setLoadingBatch] = useState(true);
    const [error, setError] = useState(null);
    const [phaseCompleted, setPhaseCompleted] = useState(false);
    const [phase2SectionsCompleted, setPhase2SectionsCompleted] = useState({});
    const [phaseResults, setPhaseResults] = useState(null);

    const resolveProgress = useCallback(async (token, assessmentIdParam) => {
        try {
            const progressResponse = await api.get(`/assessments/${assessmentIdParam}/progress`, {
                params: { sessionToken: token },
            });
            const progressData = progressResponse.data;
            setCurrentPhase(progressData.currentPhase);
            setCurrentSection(progressData.currentSection);
            setCompletionPercentage(progressData.completionPercentage || 0);
            return progressData;
        } catch (err) {
            return { currentPhase: 'PHASE1', currentSection: null, status: 'IN_PROGRESS' };
        }
    }, []);

    const initializeSession = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Veuillez vous connecter pour passer le test');
                return null;
            }

            const existingSessionToken = localStorage.getItem(`phase_${phaseId}_session_token`);
            const existingAssessmentId = localStorage.getItem(`phase_${phaseId}_assessment_id`);

            if (existingSessionToken && existingAssessmentId && !phaseCompleted) {
                return { sessionToken: existingSessionToken, assessmentId: existingAssessmentId };
            }

            const response = await api.post('/sessions', {
                testVersionId: 1,
                initialAssessmentType: initialAssessmentType,
                depth: 5,
                profile: {
                    startedAt: new Date().toISOString(),
                    mode: 'phase',
                    phaseId: phaseId,
                    isSimplePhase: isSimplePhase,
                },
            });

            if (response?.data) {
                const newSessionToken = response.data.sessionToken;
                const newAssessmentId = response.data.assessment.id;
                localStorage.setItem(`phase_${phaseId}_session_token`, newSessionToken);
                localStorage.setItem(`phase_${phaseId}_assessment_id`, newAssessmentId);
                return { sessionToken: newSessionToken, assessmentId: newAssessmentId };
            }
            throw new Error("Erreur lors de l'initialisation");
        } catch (err) {
            console.error('Session error:', err);
            setError(err.response?.data?.message || "Impossible d'initialiser le test");
            return null;
        }
    }, [phaseId, initialAssessmentType, isSimplePhase, phaseCompleted]);

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
                console.warn('Compute warning (continuing to fetch phase result):', computeErr);
            }

            // Récupérer les résultats via endpoint stable par assessment
            let response;
            try {
                response = await api.get(`/results/by-assessment/${assessmentIdParam}`);
            } catch (resultErr) {
                // Fallback legacy
                response = await api.get(`/results/phase${phaseId}`, {
                    params: { assessmentId: assessmentIdParam, sessionToken: token },
                });
            }

            // Pour la phase 1, afficher la page de rapport dédiée
            if (phaseId === 1) {
                localStorage.setItem('assessment_id', String(assessmentIdParam));
                localStorage.setItem('session_token', String(token));
                localStorage.setItem('phase1_report_data', JSON.stringify(response?.data || {}));
                navigate('/rapport-phase1', {
                    state: {
                        phaseResults: response?.data,
                        assessmentId: assessmentIdParam,
                        sessionToken: token,
                    },
                });
                return;
            }

            setPhaseResults(response.data);
            setPhaseCompleted(true);

            localStorage.removeItem(`phase_${phaseId}_session_token`);
            localStorage.removeItem(`phase_${phaseId}_assessment_id`);
        } catch (err) {
            console.error('Error completing phase:', err);
            // Dernière tentative pour phase 1 : afficher au moins le rapport si possible
            if (phaseId === 1) {
                try {
                    const fallback = await api.get(`/results/by-assessment/${assessmentIdParam}`);
                    localStorage.setItem('assessment_id', String(assessmentIdParam));
                    localStorage.setItem(
                        'phase1_report_data',
                        JSON.stringify(fallback?.data || {}),
                    );
                    navigate('/rapport-phase1', {
                        state: {
                            phaseResults: fallback?.data,
                            assessmentId: assessmentIdParam,
                        },
                    });
                    return;
                } catch (finalErr) {
                    console.error('Phase1 fallback error:', finalErr);
                }
            }
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
            // Utiliser les mêmes endpoints que tests.jsx
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

    const handleBatchComplete = useCallback(async () => {
        const progressData = await submitBatch();
        if (!progressData) return;

        if (progressData.status === 'COMPLETED') {
            await completePhase(sessionToken, assessmentId);
            return;
        }

        const previousPhase = currentPhase;
        const newPhase = progressData.currentPhase;

        if (newPhase === 'PHASE1' && previousPhase === 'PHASE1') {
            await fetchBatch('PHASE1', null, sessionToken, assessmentId);
        } else if (newPhase === 'PHASE2' && previousPhase === 'PHASE1') {
            setCurrentPhase('PHASE2');
            setCurrentSection(PHASE2_SECTIONS[0].name);
            await fetchBatch('PHASE2', PHASE2_SECTIONS[0].name, sessionToken, assessmentId);
        } else if (newPhase === 'PHASE2' && previousPhase === 'PHASE2') {
            if (progressData.currentSection !== currentSection) {
                setPhase2SectionsCompleted((prev) => ({ ...prev, [currentSection]: true }));
                setCurrentSection(progressData.currentSection);
                await fetchBatch('PHASE2', progressData.currentSection, sessionToken, assessmentId);
            } else {
                await fetchBatch('PHASE2', currentSection, sessionToken, assessmentId);
            }
        }
    }, [currentPhase, currentSection, fetchBatch, submitBatch, sessionToken, assessmentId]);

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
                const progressData = await resolveProgress(
                    sessionData.sessionToken,
                    sessionData.assessmentId,
                );
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
            }
            setLoading(false);
        };
        loadPhase();
    }, [phaseId, initializeSession, fetchBatch, resolveProgress]);

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
                        Chargement de la Phase {phaseId}...
                    </p>
                </div>
            </div>
        );
    }

    if (phaseCompleted && phaseResults) {
        return (
            <PhaseResult
                phaseId={phaseId}
                results={phaseResults}
                onNewTest={() => {
                    localStorage.removeItem(`phase_${phaseId}_session_token`);
                    localStorage.removeItem(`phase_${phaseId}_assessment_id`);
                    setPhaseCompleted(false);
                    setPhaseResults(null);
                    setCurrentBatch([]);
                    setDraftAnswers({});
                    setPhase2SectionsCompleted({});
                    window.location.reload();
                }}
            />
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
                    currentPhase={currentPhase || 'PHASE1'}
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
                                <span className="section-icon">{section.icon}</span>
                                <span className="section-name">{section.label}</span>
                                {phase2SectionsCompleted[section.name] && (
                                    <span className="section-check">✓</span>
                                )}
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
                                    currentPhase={currentPhase}
                                    currentSection={currentSection}
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

// Composant d'affichage des résultats
const PhaseResult = ({ phaseId, results, onNewTest }) => {
    const navigate = useNavigate();

    // Phase 1 - Résultats spécifiques
    if (phaseId === 1) {
        return (
            <div className="phase-result-page">
                <div className="phase-result-container">
                    <div className="phase-result-header">
                        <h1> Résultat de la Phase 1 - Amorçage</h1>
                        <p>Voici votre profil de personnalité basé sur vos réponses</p>
                    </div>

                    <div className="result-card">
                        <h3>Votre code de profil</h3>
                        <div className="profile-code-display">
                            <span className="code-badge-large">
                                {results?.phase1Code || results?.code || 'PEN'}
                            </span>
                        </div>
                        <p className="profile-description">
                            {results?.description ||
                                'Vous êtes curieux, analytique et aimez explorer de nouveaux horizons.'}
                        </p>
                    </div>

                    <div className="result-card">
                        <h3> Vos traits dominants</h3>
                        <div className="traits-list">
                            {(
                                results?.traits || [
                                    'Curiosité intellectuelle',
                                    "Capacité d'analyse",
                                    'Autonomie',
                                ]
                            ).map((trait, i) => (
                                <div key={i} className="trait-badge">
                                    {trait}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="phase-result-actions">
                        <button
                            className="btn-secondary"
                            onClick={() => navigate('/tests-orientations')}
                        >
                            ← Retour
                        </button>
                        <button className="btn-primary" onClick={onNewTest}>
                            Refaire la phase
                        </button>
                        <button className="btn-outline" onClick={() => navigate('/tests')}>
                            Test complet
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const scores = results?.phase2Scores ||
        results?.scores || { I: 88, E: 72, S: 78, R: 65, A: 55, C: 45 };
    const code = results?.phase2Code || results?.code || 'IES';
    const names = {
        I: 'Investigateur',
        E: 'Entreprenant',
        S: 'Social',
        R: 'Réaliste',
        A: 'Artistique',
        C: 'Conventionnel',
    };
    const icons = { I: '🔬', E: '💼', S: '👥', R: '🔧', A: '🎨', C: '📋' };
    const colors = {
        I: '#3b82f6',
        E: '#f59e0b',
        S: '#10b981',
        R: '#ef4444',
        A: '#ec4899',
        C: '#8b5cf6',
    };

    const phaseTitles = {
        2: { title: 'Phase 2 - Aptitudes', subtitle: 'Voici votre profil RIASEC détaillé' },
        3: { title: 'Phase 3 - Compétences', subtitle: 'Découvrez vos compétences clés' },
        4: { title: 'Phase 4 - Personnalité', subtitle: 'Analyse approfondie de votre profil' },
    };

    const currentTitle = phaseTitles[phaseId] || phaseTitles[2];

    return (
        <div className="phase-result-page">
            <div className="phase-result-container">
                <div className="phase-result-header">
                    <h1>💡 {currentTitle.title}</h1>
                    <p>{currentTitle.subtitle}</p>
                </div>

                <div className="result-card">
                    <h3> Votre code RIASEC</h3>
                    <div className="riasec-code-display">
                        {code.split('').map((letter, i) => (
                            <span
                                key={i}
                                className={`riasec-letter letter-${letter.toLowerCase()}`}
                            >
                                {letter}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="result-card">
                    <h3>📊 Vos scores par dimension</h3>
                    {Object.entries(scores).map(([key, score]) => (
                        <div key={key} className="score-card">
                            <div className="score-header">
                                <span className="score-icon">{icons[key]}</span>
                                <span className="score-name">{names[key]}</span>
                                <span className="score-value">{score}%</span>
                            </div>
                            <div className="score-bar-container">
                                <div
                                    className="score-bar-fill"
                                    style={{ width: `${score}%`, background: colors[key] }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="phase-result-actions">
                    <button
                        className="btn-secondary"
                        onClick={() => navigate('/tests-orientations')}
                    >
                        ← Retour
                    </button>
                    <button className="btn-primary" onClick={onNewTest}>
                        Refaire la phase
                    </button>
                    <button className="btn-outline" onClick={() => navigate('/tests')}>
                        Test complet
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PhaseTest;
