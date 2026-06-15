import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { verifyEmail } from '../services/authService';

const VerifyEmailGuard = () => {
    const [status, setStatus] = useState('verifying');
    const [errorMessage, setErrorMessage] = useState('');
    const [countdown, setCountdown] = useState(3);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const hasRun = useRef(false); // évite double appel en React StrictMode

    const token = searchParams.get('token');

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const verifyAndRedirect = async () => {
            if (!token) {
                setStatus('error');
                setErrorMessage("Token de vérification manquant dans l'URL.");
                return;
            }

                            try {
                const result = await verifyEmail(token);
                setStatus('success');

                // Attendre que le backend finalise l'activation en DB
                // avant de rediriger (évite le 403 "account not active")
                const waitForActivation = () => new Promise(resolve => setTimeout(resolve, 2000));
                await waitForActivation();

                let count = 3;
                const timer = setInterval(() => {
                    count -= 1;
                    setCountdown(count);
                    if (count <= 0) {
                        clearInterval(timer);
                        navigate('/auth/login', {
                            state: {
                                message: 'Email vérifié avec succès. Vous pouvez maintenant vous connecter.',
                                verified: true,
                            },
                        });
                    }
                }, 1000);
            } catch (error) {
                setStatus('error');
                setErrorMessage(error.message || 'Token invalide ou expiré.');
            }
        };

        verifyAndRedirect();
    }, [token, navigate]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
            padding: '2rem',
            flexDirection: 'column',
            textAlign: 'center',
            gap: '1rem',
        }}>
            {status === 'verifying' && (
                <>
                    <h2>Vérification de votre email…</h2>
                    <p>Nous activons votre compte, veuillez patienter.</p>
                </>
            )}

            {status === 'success' && (
                <>
                    <h2 style={{ color: '#1f7a1f' }}>✅ Email vérifié !</h2>
                    <p>Redirection vers la connexion dans <strong>{countdown}</strong> seconde{countdown > 1 ? 's' : ''}…</p>
                    <Link to="/auth/login">Aller à la connexion maintenant</Link>
                </>
            )}

            {status === 'error' && (
                <>
                    <h2 style={{ color: '#b42318' }}>Vérification échouée</h2>
                    <p>{errorMessage}</p>
                    <Link to="/auth/login" className="toggle-link">
                        Retour à la connexion
                    </Link>
                </>
            )}
        </div>
    );
};

export default VerifyEmailGuard;