import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext';
import Home from './pages/home';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import MetiersPorteurs from './pages/metiers-porteurs';
import Orientations from './pages/orientations';
import Support from './pages/support';
import Test from './pages/tests';
import Testsorientations from './pages/tests-orientations';
import Phase1Test from './pages/phase1Test'; 
import UniversitiesPage from './pages/universites-formations';
import HeaderParent from './components/headerParent';
import Footer from './components/footer';
import ScrollToTop from './components/scrollToTop';
import BoursesAides from './pages/bourses-aides';
import Parcours from './pages/parcours';
import Contact from './pages/contact';
import Guide from './pages/guide-riasec';
import Faq from './pages/faq';
import RapportPhase1 from './pages/rapport-phase1';
import VerifyEmailGuard from './components/VerifyEmailGuard';
    
const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();
    const location = useLocation();
    const isAuth = !!token;

    if (!isAuth) {
        return <Navigate to="/auth/login" state={{ from: location.pathname + location.search }} replace />;
    }

    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <ScrollToTop />

                <HeaderParent />
                <Routes>
                    <Route path="/" element={<Navigate to="/accueil" replace />} />
                    <Route path="/accueil" element={<Home />} />
                    <Route path="/auth/login" element={<LoginPage />} />
                    <Route path="/auth/register" element={<RegisterPage />} />
                    <Route path="/auth/check-email" element={<VerifyEmailGuard />} />

                    <Route path="/universites-formations" element={<UniversitiesPage />} />

                    <Route

                        path="/metiers-porteurs"
                        element={
                            <ProtectedRoute>
                                <MetiersPorteurs />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/support"
                        element={
                            <ProtectedRoute>
                                <Support />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/tests-orientations"
                        element={
                            <ProtectedRoute>
                                <Testsorientations />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/tests"
                        element={
                            <ProtectedRoute>
                                <Test />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/tests/phase/:id"
                        element={
                            <ProtectedRoute>
                                <PhaseTest />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/phase1Test"
                        element={
                            <ProtectedRoute>
                                <Phase1Test />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/orientations"
                        element={
                            <ProtectedRoute>
                                <Orientations />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/bourses-aides"
                        element={
                            <ProtectedRoute>
                                <BoursesAides />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/contact"
                        element={
                            <ProtectedRoute>
                                <Contact />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/parcours"
                        element={
                            <ProtectedRoute>
                                <Parcours />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/guide-riasec"
                        element={
                            <ProtectedRoute>
                                <Guide />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/faq"
                        element={
                            <ProtectedRoute>
                                <Faq />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/rapport-phase1"
                        element={
                            <ProtectedRoute>
                                <RapportPhase1 />
                            </ProtectedRoute>
                        }
                    />

                    
                </Routes>
                <Footer />
            </Router>
        </AuthProvider>
    );
}

export default App;
