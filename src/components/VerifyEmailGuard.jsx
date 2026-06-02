// components/VerifyEmailGuard.jsx (CRÉEZ CE FICHIER)
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
        setErrorMessage('Token de vérification manquant');
        setTimeout(() => navigate('/login?error=missing_token'), 2000);
        return;
      }

      try {
        await verifyEmail(token);
        setStatus('success');
        
        // Rediriger vers login avec message de succès
        setTimeout(() => {
          navigate('/login', { 
            state: { message: '✅ Email vérifié avec succès ! Vous pouvez maintenant vous connecter.' } 
          });
        }, 1500);
        
      } catch (error) {
        setStatus('error');
        setErrorMessage(error.message || 'Token invalide ou expiré');
        
        setTimeout(() => {
          navigate('/login?error=verification_failed');
        }, 2000);
      }
    };

    verifyAndRedirect();
  }, [token, navigate]);

  // Affichage
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '60vh',
      flexDirection: 'column',
      textAlign: 'center'
    }}>
      {status === 'verifying' && (
        <>
          <h2>🔐 Vérification de votre email...</h2>
          <p>Veuillez patienter, nous activons votre compte.</p>
        </>
      )}
      
      {status === 'success' && (
        <>
          <h2 style={{ color: 'green' }}>✅ Email vérifié !</h2>
          <p>Redirection vers la page de connexion...</p>
        </>
      )}
      
      {status === 'error' && (
        <>
          <h2 style={{ color: 'red' }}>❌ Vérification échouée</h2>
          <p>{errorMessage}</p>
          <p>Redirection vers la page de connexion...</p>
        </>
      )}
    </div>
  );
};

export default VerifyEmailGuard;