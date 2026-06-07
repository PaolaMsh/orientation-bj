import React, { useState, useEffect } from 'react';
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
    faHeart,
    faShare,
    faBookmark,
    faEuroSign,
    faDollarSign,
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
    faBriefcase,
    faHome,
    faChartLine,
    faInfoCircle,
    faChevronDown,
    faChevronUp,
    faPassport,
    faPalette,
    faMusic,
    faFilm,
    faBook,
    faLaptopCode,
    faSeedling,
    faHandsHelping,
    faChalkboardTeacher,
    faMask,
    faPaintbrush,
    faCamera,
    faGuitar,
    faDrum,
    faFeather,
    faBrush,
    faMicrophoneAlt,
    faCompactDisc,
    faHandHoldingHeart,
} from '@fortawesome/free-solid-svg-icons';

import {
    faFacebook,
    faTwitter,
    faWhatsapp,
    faLinkedin,
    faCcVisa,
} from '@fortawesome/free-brands-svg-icons';

import '../styles/bourses-aides.css';

const Scholarships = () => {
    // États pour les données
    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // États pour les filtres
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('all');
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [expandedCard, setExpandedCard] = useState(null);
    const [activeTab, setActiveTab] = useState('all');

    // États pour les options des filtres
    const [countries, setCountries] = useState(['all']);
    const [levels, setLevels] = useState(['all']);
    const [types, setTypes] = useState(['all']);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

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

    // Récupérer toutes les bourses depuis l'API
    const fetchAllScholarships = async () => {
        setLoading(true);
        setError(null);

        try {
            // Utiliser l'endpoint /api/v1/scholarships
            const response = await api.get('/scholarships');

            // Si la réponse est un tableau direct
            let allScholarships = Array.isArray(response.data)
                ? response.data
                : response.data.data || [];

            // Appliquer les filtres côté frontend (car l'API ne supporte pas les filtres)
            let filtered = [...allScholarships];

            // Filtre par recherche
            if (searchTerm) {
                filtered = filtered.filter(
                    (s) =>
                        s.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.university?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (s.fields &&
                            s.fields.some((f) =>
                                f.toLowerCase().includes(searchTerm.toLowerCase()),
                            )),
                );
            }

            // Filtre par pays
            if (selectedCountry !== 'all') {
                filtered = filtered.filter((s) => s.country === selectedCountry);
            }

            // Filtre par niveau
            if (selectedLevel !== 'all') {
                filtered = filtered.filter((s) => s.level === selectedLevel);
            }

            // Filtre par type
            if (selectedType !== 'all') {
                filtered = filtered.filter((s) => s.type === selectedType);
            }

            // Filtre par onglet
            if (activeTab === 'benin') {
                filtered = filtered.filter((s) => s.beninPartnership === true);
            }
            if (activeTab === 'artistic') {
                filtered = filtered.filter((s) => s.artistic === true);
            }
            if (activeTab === 'full') {
                filtered = filtered.filter((s) => s.amount === 'Complet');
            }
            if (activeTab === 'deadline') {
                filtered = filtered.filter((s) => {
                    const daysLeft = getDaysLeft(s.deadline);
                    return daysLeft <= 30 && daysLeft > 0;
                });
            }

            // Pagination manuelle
            const start = (currentPage - 1) * 12;
            const end = start + 12;
            const paginatedData = filtered.slice(start, end);

            setScholarships(paginatedData);
            setTotalResults(filtered.length);
            setTotalPages(Math.ceil(filtered.length / 12));
        } catch (err) {
            console.error('Erreur:', err);
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    // Recherche avec l'endpoint /api/v1/scholarships/search
    const searchScholarships = async () => {
        if (!searchTerm) {
            fetchAllScholarships();
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await api.get('/scholarships/search', {
                params: { q: searchTerm },
            });

            let results = Array.isArray(response.data) ? response.data : response.data.data || [];

            // Appliquer les autres filtres sur les résultats de recherche
            let filtered = [...results];

            if (selectedCountry !== 'all') {
                filtered = filtered.filter((s) => s.country === selectedCountry);
            }
            if (selectedLevel !== 'all') {
                filtered = filtered.filter((s) => s.level === selectedLevel);
            }
            if (selectedType !== 'all') {
                filtered = filtered.filter((s) => s.type === selectedType);
            }
            if (activeTab === 'benin') {
                filtered = filtered.filter((s) => s.beninPartnership === true);
            }
            if (activeTab === 'artistic') {
                filtered = filtered.filter((s) => s.artistic === true);
            }
            if (activeTab === 'full') {
                filtered = filtered.filter((s) => s.amount === 'Complet');
            }
            if (activeTab === 'deadline') {
                filtered = filtered.filter((s) => {
                    const daysLeft = getDaysLeft(s.deadline);
                    return daysLeft <= 30 && daysLeft > 0;
                });
            }

            // Pagination
            const start = (currentPage - 1) * 12;
            const end = start + 12;
            const paginatedData = filtered.slice(start, end);

            setScholarships(paginatedData);
            setTotalResults(filtered.length);
            setTotalPages(Math.ceil(filtered.length / 12));
        } catch (err) {
            console.error('Erreur recherche:', err);
            fetchAllScholarships();
        } finally {
            setLoading(false);
        }
    };

    // Récupérer les options des filtres depuis les données
    const fetchFilterOptions = async () => {
        try {
            const response = await api.get('/scholarships');
            let data = Array.isArray(response.data) ? response.data : response.data.data || [];

            const uniqueCountries = [...new Set(data.map((s) => s.country).filter(Boolean))];
            const uniqueLevels = [...new Set(data.map((s) => s.level).filter(Boolean))];
            const uniqueTypes = [...new Set(data.map((s) => s.type).filter(Boolean))];

            setCountries(['all', ...uniqueCountries]);
            setLevels(['all', ...uniqueLevels]);
            setTypes(['all', ...uniqueTypes]);
        } catch (err) {
            console.error('Erreur chargement filtres:', err);
        }
    };

    // Récupérer une bourse spécifique par ID
    const fetchScholarshipById = async (id) => {
        try {
            const response = await api.get(`/scholarships/${id}`);
            return response.data;
        } catch (err) {
            console.error('Erreur:', err);
            return null;
        }
    };

    // Formater la date
    const formatDate = (dateString) => {
        if (!dateString) return 'Date non définie';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    // Effets
    useEffect(() => {
        if (searchTerm) {
            searchScholarships();
        } else {
            fetchAllScholarships();
        }
    }, [searchTerm, selectedCountry, selectedLevel, selectedType, activeTab, currentPage]);

    useEffect(() => {
        fetchFilterOptions();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCountry, selectedLevel, selectedType, activeTab]);

    if (loading && scholarships.length === 0) {
        return (
            <div className="scholarships-page">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Chargement des bourses...</p>
                </div>
            </div>
        );
    }

    if (error && scholarships.length === 0) {
        return (
            <div className="scholarships-page">
                <div className="error-container">
                    <FontAwesomeIcon icon={faTimesCircle} />
                    <h3>Erreur de chargement</h3>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()}>Réessayer</button>
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
                            <strong className="benin-highlight">
                                {' '}
                                Nombreuses bourses en partenariat avec le Bénin !
                            </strong>
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
                                placeholder="Rechercher une bourse, un pays, une université, un domaine ..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
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
                            <div className="filter-group">
                                <label>Type de bourse</label>
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                >
                                    {types.map((type) => (
                                        <option key={type} value={type}>
                                            {type === 'all' ? 'Tous les types' : type}
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
                        <span>{totalResults} bourses trouvées</span>
                        
                        {loading && <span className="loading-badge">Chargement...</span>}
                    </div>

                    <div className="scholarships-grid">
                        {scholarships.map((scholarship) => (
                            <div
                                key={scholarship.id}
                                className={`scholarship-card ${expandedCard === scholarship.id ? 'expanded' : ''} ${scholarship.beninPartnership ? 'benin-partnership' : ''} ${scholarship.artistic ? 'artistic-card' : ''}`}
                            >
                                <div className="card-header">
                                    <div className="card-badge">
                                        <FontAwesomeIcon
                                            icon={scholarship.artistic ? faPalette : faAward}
                                        />
                                        <span>{scholarship.type || 'Bourse'}</span>
                                    </div>
                                </div>

                                <div className="card-content">
                                    <h3>{scholarship.title}</h3>
                                    <div className="location">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                                        <span>{scholarship.country}</span>
                                        <span className="university">{scholarship.university}</span>
                                    </div>

                                    <div className="rating">
                                        <div className="stars">
                                            {[...Array(5)].map((_, i) => (
                                                <FontAwesomeIcon
                                                    key={i}
                                                    icon={
                                                        i < Math.floor(scholarship.rating || 0)
                                                            ? faStar
                                                            : i < (scholarship.rating || 0)
                                                              ? faStarHalfAlt
                                                              : faStar
                                                    }
                                                    className="star"
                                                />
                                            ))}
                                            <span className="rating-value">
                                                {scholarship.rating || 'Nouveau'}
                                            </span>
                                        </div>
                                        <span className="applications">
                                            <FontAwesomeIcon icon={faUsers} />
                                            {scholarship.applications || 0} candidatures
                                        </span>
                                    </div>

                                    <p className="description">{scholarship.description}</p>

                                    <div className="fields-preview">
                                        {(scholarship.fields || []).slice(0, 3).map((field, i) => (
                                            <span key={i} className="field-preview-tag">
                                                {field}
                                            </span>
                                        ))}
                                        {(scholarship.fields || []).length > 3 && (
                                            <span className="field-preview-tag more">
                                                +{(scholarship.fields || []).length - 3}
                                            </span>
                                        )}
                                    </div>

                                    <div className="deadline">
                                        <div
                                            className={`deadline-badge ${getDaysLeft(scholarship.deadline) <= 30 ? 'urgent' : ''}`}
                                        >
                                            <FontAwesomeIcon icon={faCalendarAlt} />
                                            <span>
                                                Date limite: {formatDate(scholarship.deadline)}
                                            </span>
                                        </div>
                                        <div className="days-left">
                                            <span
                                                className={`days ${getDaysLeft(scholarship.deadline) <= 30 ? 'urgent' : ''}`}
                                            >
                                                {getDaysLeft(scholarship.deadline)} jours restants
                                            </span>
                                        </div>
                                    </div>

                                    <div className="card-footer">
                                        <button
                                            className="details-btn"
                                            onClick={() =>
                                                setExpandedCard(
                                                    expandedCard === scholarship.id
                                                        ? null
                                                        : scholarship.id,
                                                )
                                            }
                                        >
                                            {expandedCard === scholarship.id
                                                ? 'Voir moins'
                                                : 'Voir les détails'}
                                            <FontAwesomeIcon
                                                icon={
                                                    expandedCard === scholarship.id
                                                        ? faChevronUp
                                                        : faChevronDown
                                                }
                                            />
                                        </button>
                                        <button
                                            className="apply-btn"
                                            onClick={() =>
                                                window.open(scholarship.applyUrl || '#', '_blank')
                                            }
                                        >
                                            Postuler
                                            <FontAwesomeIcon icon={faExternalLinkAlt} />
                                        </button>
                                    </div>
                                </div>

                                {expandedCard === scholarship.id && (
                                    <div className="card-expanded slide-down">
                                        <div className="expanded-section">
                                            <h4>
                                                <FontAwesomeIcon icon={faCheckCircle} />
                                                Couverture de la bourse
                                            </h4>
                                            <ul>
                                                {(scholarship.coverage || []).map((item, i) => (
                                                    <li key={i}>
                                                        <FontAwesomeIcon
                                                            icon={faCheckCircle}
                                                            className="check-icon"
                                                        />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="expanded-section">
                                            <h4>
                                                <FontAwesomeIcon icon={faFileAlt} />
                                                Conditions d'éligibilité
                                            </h4>
                                            <ul>
                                                {(scholarship.requirements || []).map((req, i) => (
                                                    <li key={i}>
                                                        <FontAwesomeIcon
                                                            icon={faCheckCircle}
                                                            className="check-icon"
                                                        />
                                                        {req}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="expanded-section">
                                            <h4>
                                                <FontAwesomeIcon icon={faLanguage} />
                                                Langues requises
                                            </h4>
                                            <div className="languages">
                                                {(scholarship.languages || []).map((lang, i) => (
                                                    <span key={i} className="language-tag">
                                                        {lang}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="expanded-section">
                                            <h4>
                                                <FontAwesomeIcon icon={faUniversity} />
                                                Domaines d'études
                                            </h4>
                                            <div className="fields">
                                                {(scholarship.fields || []).map((field, i) => (
                                                    <span key={i} className="field-tag">
                                                        {field}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="expanded-actions">
                                            <button
                                                className="btn-primary"
                                                onClick={() =>
                                                    window.open(
                                                        scholarship.officialUrl || '#',
                                                        '_blank',
                                                    )
                                                }
                                            >
                                                <FontAwesomeIcon icon={faFileAlt} />
                                                Site officiel
                                            </button>
                                            <button className="btn-secondary">
                                                <FontAwesomeIcon icon={faInfoCircle} />
                                                Guide de candidature
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {!loading && scholarships.length === 0 && (
                        <div className="no-results">
                            <FontAwesomeIcon icon={faSearch} />
                            <h3>Aucune bourse trouvée</h3>
                            <p>Essayez de modifier vos critères de recherche</p>
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                Précédent
                            </button>
                            <span>
                                Page {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Suivant
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="benin-special-section">
                <div className="container">
                    <div className="benin-special-content">
                        <div className="benin-flag">
                            <span className="flag-stripe green"></span>
                            <span className="flag-stripe yellow"></span>
                            <span className="flag-stripe red"></span>
                        </div>
                        <h2>Opportunités spéciales pour les étudiants béninois</h2>
                        <p>
                            Le Bénin a développé des partenariats stratégiques avec plusieurs pays
                            pour offrir des bourses d'excellence à ses étudiants. Profitez de ces
                            opportunités uniques pour étudier à l'étranger dans des conditions
                            optimales.
                        </p>
                    </div>
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

            <div className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Prêt à commencer votre voyage académique ?</h2>
                        <p>
                            Inscrivez-vous pour recevoir les dernières opportunités de bourses
                            directement dans votre boîte mail
                        </p>
                        <div className="cta-form">
                            <input type="email" placeholder="Votre adresse email" />
                            <button>S'abonner aux alertes</button>
                        </div>
                        <div className="cta-note">
                            <FontAwesomeIcon icon={faInfoCircle} />
                            <span>Recevez des alertes personnalisées selon votre profil</span>
                        </div>
                    </div>
                </div>
            </div>

           
        </div>
    );
};

export default Scholarships;
