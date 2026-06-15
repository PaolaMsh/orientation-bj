import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { verifyEmail } from '../services/authService';

const VerifyEmailGuard = () => {
    const [status, setStatus] = useState('verifying');
    const [errorMessage, setErrorMessage] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get('token');

    useEffect(() => {
        const verifyAndRedirect = async () => {
            if (!token) {
                setStatus('error');
                setErrorMessage('Token de vérification manquant dans l’URL.');
                return;
            }

            try {
                await verifyEmail(token);
                setStatus('success');

                setTimeout(() => {
                    navigate('/auth/login', {
                        state: {
                            message: 'Email vérifié avec succès. Vous pouvez maintenant vous connecter.',
                        },
                    });
                }, 1600);
            } catch (error) {
                setStatus('error');
                setErrorMessage(error.message || 'Token invalide ou expiré.');
            }
        };

        verifyAndRedirect();
    }, [token, navigate]);

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '60vh',
                padding: '2rem',
                flexDirection: 'column',
                textAlign: 'center',
                gap: '1rem',
            }}
        >
            {status === 'verifying' && (
                <>
                    <h2>Vérification de votre email</h2>
                    <p>Nous activons votre compte à partir du token présent dans le lien.</p>
                </>
            )}

            {status === 'success' && (
                <>
                    <h2 style={{ color: '#1f7a1f' }}>Email vérifié</h2>
                    <p>Redirection vers la page de connexion...</p>
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
