// components/FormationCard.jsx
import React, { useState } from 'react';
import { IconInfo, IconCalendar, IconHome, IconExternalLink } from './Icons';

const FormationCard = ({ formation, onClick }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="formation-card" onClick={() => setExpanded(!expanded)}>
            <div className="formation-card-header">
                <h4>{formation.name}</h4>
                <span className="formation-level">{formation.level || 'Niveau non spécifié'}</span>
            </div>

            {expanded && (
                <div className="formation-card-details">
                    <p>
                        <strong>Description:</strong>{' '}
                        {formation.description || 'Aucune description disponible'}
                    </p>
                    <p>
                        <strong>Durée:</strong> {formation.duration || 'Non spécifiée'}
                    </p>
                    <p>
                        <strong>Débouchés:</strong>{' '}
                        {formation.careers?.join(', ') || 'Non spécifiés'}
                    </p>

                    {formation.website && (
                        <a
                            href={formation.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="formation-link"
                        >
                            En savoir plus <IconExternalLink size={12} />
                        </a>
                    )}
                </div>
            )}
        </div>
    );
};
