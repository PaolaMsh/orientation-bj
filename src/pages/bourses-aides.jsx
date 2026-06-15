import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import api from '../services/api';

import {
    faGraduationCap,
    faGlobeAfrica,
    faPlane,
    faCalendarAlt,
    faMoneyBillWave,
    faClock,
    faSearch,
    faFilter,
    faBookmark,
    faMapMarkerAlt,
    faUniversity,
    faAward,
    faLanguage,
    faFileAlt,
    faCheckCircle,
    faTimesCircle,
    faExternalLinkAlt,
    faStar,
    faStarHalfAlt,
    faUsers,
    faInfoCircle,
    faChevronDown,
    faChevronUp,
    faPalette,
    faSpinner,
} from '@fortawesome/free-solid-svg-icons';

import '../styles/bourses-aides.css';
import { bourseService } from '../services/bourseService';
import { saveScholarship } from '../utils/store';

const Scholarships = () => {
    const [scholarships, setScholarships] = useState([]);
    const [allScholarships, setAllScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('all');
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [expandedCard, setExpandedCard] = useState(null);
    const [countries, setCountries] = useState(['all']);
    const [levels, setLevels] = useState(['all']);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [savedMessage, setSavedMessage] = useState(null);
    const [searching, setSearching] = useState(false); // État pour le spinner

    const itemsPerPage = 12;

    const tips = [
        {
            title: 'Préparez votre dossier tôt',
            description: 'Commencez au moins 6 mois avant la date limite',
            icon: faClock,
        },
        {
            title: 'Soignez votre lettre de motivation',
            description: 'Personnalisez-la pour chaque bourse',
            icon: faFileAlt,
        },
        {
            title: 'Obtenez de bonnes recommandations',
            description: 'Choisissez des professeurs qui vous connaissent bien',
            icon: faUsers,
        },
        {
            title: 'Préparez les tests de langue',
            description: 'TOEFL, IELTS, DELF/DALF, etc.',
            icon: faLanguage,
        },
    ];

    const mapScholarshipForSaving = (scholarship) => {
        return {
            id: scholarship.id,
            title: scholarship.title,
            description: scholarship.description,
            country: scholarship.country,
            university: scholarship.university,
            type: scholarship.type,
            level: scholarship.level,
            deadline: scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString('fr-FR') : 'Non spécifiée',
            amount: scholarship.amount,
            status: getStatus(scholarship.deadline),
            link: scholarship.applyUrl || scholarship.officialUrl,
            benefits: scholarship.coverage || [],
            conditions: scholarship.requirements || [],
            fields: scholarship.fields || [],
            savedAt: new Date().toISOString()
        };
    };

    const getStatus = (deadline) => {
        if (!deadline) return 'ouvert';
        const deadlineDate = new Date(deadline);
        const today = new Date();
        return deadlineDate > today ? 'ouvert' : 'fermé';
    };

    const mapScholarshipData = (apiScholarship) => {
        return {
            id: apiScholarship.id,
            title: apiScholarship.title,
            description: apiScholarship.description,
            country: apiScholarship.country,
            university: apiScholarship.provider || apiScholarship.universities?.[0]?.name || 'Non spécifié',
            type: apiScholarship.fundingType === 'FULL' ? 'Bourse complète' : 
                   apiScholarship.fundingType === 'PARTIAL' ? 'Bourse partielle' : 'Bourse',
            level: apiScholarship.level,
            deadline: apiScholarship.applicationCloseAt,
            amount: apiScholarship.amountLabel || 
                    (apiScholarship.fundingType === 'FULL' ? 'Bourse complète' : 'Bourse partielle'),
            coverage: apiScholarship.benefits || [],
            requirements: apiScholarship.conditions || [],
            languages: apiScholarship.requiredDocuments?.languageRequirement ? 
                       [apiScholarship.requiredDocuments.languageRequirement] : ['Non spécifié'],
            fields: apiScholarship.field ? [apiScholarship.field] : [],
            rating: 4.5, 
            applications: apiScholarship.seats || 0,
            applyUrl: apiScholarship.applicationUrl,
            officialUrl: apiScholarship.applicationUrl,
            beninPartnership: apiScholarship.country === 'Bénin' || apiScholarship.provider?.includes('Bénin'),
            artistic: apiScholarship.field?.toLowerCase().includes('art') || false,
        };
    };

    const handleSaveScholarship = async (scholarship, e) => {
        e.stopPropagation();
        
        try {
            const token = localStorage.getItem('token');
            
            if (token) {
                try {
                    await api.post('/users/me/saved-scholarships', {
                        scholarshipId: scholarship.id,
                        scholarshipData: scholarship
                    });
                } catch (apiError) {
                    console.warn('API save failed, using local storage:', apiError);
                }
            }
            
            const scholarshipToSave = mapScholarshipForSaving(scholarship);
            const saved = saveScholarship(scholarshipToSave);
            
            if (saved) {
                setSavedMessage({ id: scholarship.id, text: '✓ Bourse enregistrée !', type: 'success' });
            } else {
                setSavedMessage({ id: scholarship.id, text: 'ℹ️ Déjà dans vos favoris', type: 'info' });
            }
            setTimeout(() => setSavedMessage(null), 3000);
        } catch (error) {
            console.error('Error saving scholarship:', error);
            const scholarshipToSave = mapScholarshipForSaving(scholarship);
            const saved = saveScholarship(scholarshipToSave);
            if (saved) {
                setSavedMessage({ id: scholarship.id, text: '✓ Bourse enregistrée !', type: 'success' });
            } else {
                setSavedMessage({ id: scholarship.id, text: 'ℹ️ Déjà dans vos favoris', type: 'info' });
            }
            setTimeout(() => setSavedMessage(null), 3000);
        }
    };

    // Récupérer toutes les bourses
    const fetchAllScholarships = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await bourseService.getAllScholarships();
            let allScholarshipsData = Array.isArray(data) ? data : data.data || [];
            
            let mappedScholarships = allScholarshipsData.map(mapScholarshipData);
            
            const uniqueCountries = [...new Set(mappedScholarships.map(s => s.country).filter(Boolean))];
            const uniqueLevels = [...new Set(mappedScholarships.map(s => s.level).filter(Boolean))];
            
            setCountries(['all', ...uniqueCountries]);
            setLevels(['all', ...uniqueLevels]);
            setAllScholarships(mappedScholarships);
            
        } catch (err) {
            console.error('Erreur:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fonction de recherche
    const performSearch = async (query) => {
        if (!query.trim()) {
            setAllScholarships([]);
            fetchAllScholarships();
            return;
        }

        try {
            setSearching(true);
            const results = await bourseService.searchScholarships(query);
            let data = Array.isArray(results) ? results : results.data || [];
            let mappedResults = data.map(mapScholarshipData);
            
            // Mettre à jour les bourses avec les résultats
            setAllScholarships(mappedResults);
            
            // Mettre à jour les filtres
            const uniqueCountries = [...new Set(mappedResults.map(s => s.country).filter(Boolean))];
            const uniqueLevels = [...new Set(mappedResults.map(s => s.level).filter(Boolean))];
            
            setCountries(['all', ...uniqueCountries]);
            setLevels(['all', ...uniqueLevels]);
            
        } catch (err) {
            console.error('Erreur recherche:', err);
            setError('Aucun résultat trouvé');
        } finally {
            setSearching(false);
        }
    };

    // Filtrer et paginer les résultats
    const filterAndPaginate = () => {
        let filtered = [...allScholarships];
        
        if (selectedCountry !== 'all') {
            filtered = filtered.filter(s => s.country === selectedCountry);
        }
        
        if (selectedLevel !== 'all') {
            filtered = filtered.filter(s => s.level === selectedLevel);
        }
        
        const start = (currentPage - 1) * itemsPerPage;
        const paginatedData = filtered.slice(start, start + itemsPerPage);
        
        setScholarships(paginatedData);
        setTotalResults(filtered.length);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    };

    // Debounce pour la recherche (comme dans UniversitiesPage)
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.trim() !== '') {
                performSearch(searchTerm);
            } else {
                fetchAllScholarships();
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // Appliquer les filtres quand les données changent
    useEffect(() => {
        if (allScholarships.length > 0 || searchTerm === '') {
            filterAndPaginate();
        }
    }, [allScholarships, selectedCountry, selectedLevel, currentPage]);

    // Réinitialiser la page quand les filtres changent
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCountry, selectedLevel]);

    // Chargement initial
    useEffect(() => {
        fetchAllScholarships();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'Date non définie';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    const getDaysLeft = (deadline) => {
        if (!deadline) return 0;
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    if (loading && allScholarships.length === 0) {
        return (
            <div className="scholarships-page">
                <div className="loading-container">
                    <div className="simple-loader"></div>
                    <p>Chargement des bourses...</p>
                </div>
            </div>
        );
    }

    if (error && allScholarships.length === 0) {
        return (
            <div className="scholarships-page">
                <div className="error-container">
                    <FontAwesomeIcon icon={faTimesCircle} />
                    <h3>Erreur de chargement</h3>
                    <p>{error}</p>
                    <button onClick={() => fetchAllScholarships()}>Réessayer</button>
                </div>
            </div>
        );
    }

    return (
        <div className="scholarships-page">
            {/* Hero Section */}
            <section className="scholarships-hero">
                <div className="hero-bg-pattern"></div>
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <FontAwesomeIcon icon={faAward} />
                            <span>Opportunités internationales</span>
                        </div>
                        <h1>Bourses & Aides Financières</h1>
                        <p>
                            Découvrez les meilleures opportunités de bourses pour étudier à
                            l'étranger. Financez vos études universitaires et réalisez votre rêve de
                            mobilité internationale.
                        </p>
                    </div>
                </div>
                <div className="hero-wave">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120">
                        <path
                            fill="#f8f9fc"
                            fillOpacity="1"
                            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
                        ></path>
                    </svg>
                </div>
            </section>

            {/* Search & Filters */}
            <div className="search-section">
                <div className="container">
                    <div className="search-container">
                        <div className="search-bar">
                            <FontAwesomeIcon icon={faSearch} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Rechercher une bourse, un pays, une université..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searching && (
                                <div className="search-spinner">
                                    <FontAwesomeIcon icon={faSpinner} spin />
                                </div>
                            )}
                        </div>
                        <button
                            className={`filter-toggle ${showFilters ? 'active' : ''}`}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <FontAwesomeIcon icon={faFilter} />
                            <span>Filtres</span>
                            <FontAwesomeIcon icon={showFilters ? faChevronUp : faChevronDown} />
                        </button>
                    </div>

                    {showFilters && (
                        <div className="filters-panel slide-down">
                            <div className="filter-group">
                                <label>Pays</label>
                                <select
                                    value={selectedCountry}
                                    onChange={(e) => setSelectedCountry(e.target.value)}
                                >
                                    {countries.map((country) => (
                                        <option key={country} value={country}>
                                            {country === 'all' ? 'Tous les pays' : country}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Niveau d'études</label>
                                <select
                                    value={selectedLevel}
                                    onChange={(e) => setSelectedLevel(e.target.value)}
                                >
                                    {levels.map((level) => (
                                        <option key={level} value={level}>
                                            {level === 'all' ? 'Tous les niveaux' : level}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Scholarships Grid */}
            <div className="scholarships-section">
                <div className="container">
                    <div className="results-info">
                        <span>{totalResults} bourse{totalResults > 1 ? 's' : ''} trouvée{totalResults > 1 ? 's' : ''}</span>
                        {searching && <span className="searching-badge">Recherche en cours...</span>}
                    </div>

                    <div className="scholarships-grid">
                        {scholarships.map((scholarship) => (
                            <div
                                key={scholarship.id}
                                className={`scholarship-card ${expandedCard === scholarship.id ? 'expanded' : ''}`}
                            >
                                <div className="card-header">
                                    <div className="card-badge">
                                        <FontAwesomeIcon icon={faAward} />
                                        <span>{scholarship.type || 'Bourse'}</span>
                                    </div>
                                    <button 
                                        className="save-btn"
                                        onClick={(e) => handleSaveScholarship(scholarship, e)}
                                        title="Enregistrer cette bourse"
                                    >
                                        <FontAwesomeIcon icon={faBookmark} />
                                        <span>Enregistrer</span>
                                    </button>
                                </div>

                                {savedMessage && savedMessage.id === scholarship.id && (
                                    <div className={`save-message ${savedMessage.type}`}>
                                        {savedMessage.text}
                                    </div>
                                )}

                                <div className="card-content">
                                    <h3>{scholarship.title}</h3>
                                    <div className="location">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                                        <span>{scholarship.country || 'Non spécifié'}</span>
                                        <span className="university">{scholarship.university}</span>
                                    </div>

                                    <div className="rating">
                                        <div className="stars">
                                            {[...Array(5)].map((_, i) => (
                                                <FontAwesomeIcon
                                                    key={i}
                                                    icon={
                                                        i < Math.floor(scholarship.rating || 4.5)
                                                            ? faStar
                                                            : i < (scholarship.rating || 4.5)
                                                              ? faStarHalfAlt
                                                              : faStar
                                                    }
                                                    className="star"
                                                />
                                            ))}
                                            <span className="rating-value">
                                                {scholarship.rating || 4.5}
                                            </span>
                                        </div>
                                        <span className="applications">
                                            <FontAwesomeIcon icon={faUsers} />
                                            {scholarship.applications || 'N/A'} places
                                        </span>
                                    </div>

                                    <p className="description">
                                        {scholarship.description?.substring(0, 150)}...
                                    </p>

                                    {scholarship.fields && scholarship.fields.length > 0 && (
                                        <div className="fields-preview">
                                            {scholarship.fields.slice(0, 3).map((field, i) => (
                                                <span key={i} className="field-preview-tag">
                                                    {field}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {scholarship.deadline && (
                                        <div className="deadline">
                                            <div className={`deadline-badge ${getDaysLeft(scholarship.deadline) <= 30 ? 'urgent' : ''}`}>
                                                <FontAwesomeIcon icon={faCalendarAlt} />
                                                <span>
                                                    Date limite: {formatDate(scholarship.deadline)}
                                                </span>
                                            </div>
                                            <div className="days-left">
                                                <span className={`days ${getDaysLeft(scholarship.deadline) <= 30 ? 'urgent' : ''}`}>
                                                    {getDaysLeft(scholarship.deadline)} jours restants
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="card-footer">
                                        <button
                                            className="details-btn"
                                            onClick={() => setExpandedCard(expandedCard === scholarship.id ? null : scholarship.id)}
                                        >
                                            {expandedCard === scholarship.id ? 'Voir moins' : 'Voir les détails'}
                                            <FontAwesomeIcon icon={expandedCard === scholarship.id ? faChevronUp : faChevronDown} />
                                        </button>
                                        {scholarship.applyUrl && (
                                            <button
                                                className="apply-btn"
                                                onClick={() => window.open(scholarship.applyUrl, '_blank')}
                                            >
                                                Postuler
                                                <FontAwesomeIcon icon={faExternalLinkAlt} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {expandedCard === scholarship.id && (
                                    <div className="card-expanded slide-down">
                                        {scholarship.coverage && scholarship.coverage.length > 0 && (
                                            <div className="expanded-section">
                                                <h4>
                                                    <FontAwesomeIcon icon={faCheckCircle} />
                                                    Avantages de la bourse
                                                </h4>
                                                <ul>
                                                    {scholarship.coverage.map((item, i) => (
                                                        <li key={i}>
                                                            <FontAwesomeIcon icon={faCheckCircle} className="check-icon" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {scholarship.requirements && scholarship.requirements.length > 0 && (
                                            <div className="expanded-section">
                                                <h4>
                                                    <FontAwesomeIcon icon={faFileAlt} />
                                                    Conditions d'éligibilité
                                                </h4>
                                                <ul>
                                                    {scholarship.requirements.map((req, i) => (
                                                        <li key={i}>
                                                            <FontAwesomeIcon icon={faCheckCircle} className="check-icon" />
                                                            {req}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {scholarship.languages && scholarship.languages.length > 0 && (
                                            <div className="expanded-section">
                                                <h4>
                                                    <FontAwesomeIcon icon={faLanguage} />
                                                    Langues requises
                                                </h4>
                                                <div className="languages">
                                                    {scholarship.languages.map((lang, i) => (
                                                        <span key={i} className="language-tag">{lang}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {scholarship.fields && scholarship.fields.length > 0 && (
                                            <div className="expanded-section">
                                                <h4>
                                                    <FontAwesomeIcon icon={faUniversity} />
                                                    Domaines d'études
                                                </h4>
                                                <div className="fields">
                                                    {scholarship.fields.map((field, i) => (
                                                        <span key={i} className="field-tag">{field}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="expanded-actions">
                                            {scholarship.officialUrl && (
                                                <button className="btn-primary" onClick={() => window.open(scholarship.officialUrl, '_blank')}>
                                                    <FontAwesomeIcon icon={faFileAlt} />
                                                    Site officiel
                                                </button>
                                            )}
                                            <button className="btn-secondary" onClick={() => setExpandedCard(null)}>
                                                <FontAwesomeIcon icon={faInfoCircle} />
                                                Fermer
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {!loading && scholarships.length === 0 && !searching && (
                        <div className="no-results">
                            <FontAwesomeIcon icon={faSearch} />
                            <h3>Aucune bourse trouvée</h3>
                            <p>Essayez de modifier vos critères de recherche</p>
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                                Précédent
                            </button>
                            <span>Page {currentPage} / {totalPages}</span>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                                Suivant
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="tips-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Conseils pour réussir votre candidature</h2>
                    </div>
                    <div className="tips-grid">
                        {tips.map((tip, index) => (
                            <div key={index} className="tip-card">
                                <div className="tip-icon">
                                    <FontAwesomeIcon icon={tip.icon} />
                                </div>
                                <h3>{tip.title}</h3>
                                <p>{tip.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Scholarships;