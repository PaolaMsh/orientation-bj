import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faMapMarkerAlt,
    faGraduationCap,
    faEnvelope,
    faUniversity,
    faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';
import '../styles/universites-formations.css';
import { universityService } from '../services/universityService';

const UniversitiesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [universities, setUniversities] = useState([]);
    const [filteredUniversities, setFilteredUniversities] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                setLoading(true);
                const data = await universityService.getAllUniversities();
                const universitiesWithCorrectImages = data.map((uni) => ({
                    ...uni,

                    image:
                        uni.coverUrl &&
                        !uni.coverUrl.startsWith('/') &&
                        !uni.coverUrl.startsWith('http')
                            ? `/${uni.coverUrl}`
                            : uni.coverUrl,
                }));

                setUniversities(universitiesWithCorrectImages);
                setFilteredUniversities(universitiesWithCorrectImages);
            } catch (err) {
                console.error('Erreur:', err);
                setError('Impossible de charger les universités');
                setUniversities([]);
                setFilteredUniversities([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUniversities();
    }, []);

    useEffect(() => {
        const term = searchTerm.toLowerCase().trim();
        if (term === '') {
            setFilteredUniversities(universities);
        } else {
            const filtered = universities.filter(
                (uni) =>
                    uni.acronym.toLowerCase().includes(term) ||
                    uni.address.toLowerCase().includes(term) ||
                    uni.email?.some((e) => e.toLowerCase().includes(term)),
            );
            setFilteredUniversities(filtered);
        }
        setShowAll(false);
    }, [searchTerm, universities]);

    const visibleCount = showAll ? filteredUniversities.length : 15;
    const visibleUniversities = filteredUniversities.slice(0, visibleCount);
    const hasMore = filteredUniversities.length > 15 && !showAll;

    if (loading) {
        return (
            <div className="universities-page">
                <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
                    <div className="loader">Chargement des universités...</div>
                </div>
            </div>
        );
    }

    if (error && universities.length === 0) {
        return (
            <div className="universities-page">
                <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
                    <div className="error-message">{error}</div>
                    <button onClick={() => window.location.reload()}>Réessayer</button>
                </div>
            </div>
        );
    }

    return (
        <div className="universities-page">
            <div className="container">
                <div className="search-header">
                    <h1>Métiers et formations au Bénin</h1>
                    <p>
                        Découvrez plus de {universities.length} établissements d'enseignement
                        supérieur
                    </p>
                    <div className="search-bar">
                        <FontAwesomeIcon icon={faSearch} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Rechercher par nom, localisation ou filière..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="results-count">
                        {filteredUniversities.length} résultat
                        {filteredUniversities.length > 1 ? 's' : ''} trouvé
                        {filteredUniversities.length > 1 ? 's' : ''}
                    </div>
                </div>

                <div className="universities-grid">
                    {visibleUniversities.map((uni) => (
                        <div key={uni.id} className="uni-card">
                            <div className="uni-image">
                                <img src={uni.image} alt={uni.name} />
                            </div>
                            <div className="uni-content">
                                <h3>{uni.name}</h3>
                                <div className="uni-acronym">
                                    <FontAwesomeIcon icon={faGraduationCap} />
                                    <span>{uni.acronym}</span>
                                </div>
                                <div className="uni-address">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                                    <span>{uni.address}</span>
                                </div>
                                <div className="uni-email">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                    <span>{uni.email}</span>
                                </div>

                                <a
                                    href={uni.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="read-more-link"
                                >
                                    <FontAwesomeIcon icon={faExternalLinkAlt} /> Lire plus
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {hasMore && (
                    <div className="see-more-container">
                        <button className="see-more-btn" onClick={() => setShowAll(true)}>
                            Voir plus ({filteredUniversities.length - 15} universités
                            supplémentaires)
                        </button>
                    </div>
                )}

                {filteredUniversities.length === 0 && (
                    <div className="no-results">
                        <FontAwesomeIcon icon={faUniversity} />
                        <p>Aucune université ne correspond à votre recherche.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UniversitiesPage;
