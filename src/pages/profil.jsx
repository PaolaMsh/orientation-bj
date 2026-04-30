// ProfilePage.jsx
import React, { useState } from 'react';
import '../styles/profil.css';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "Koffi Amoussou",
    age: "18",
    phone: "+229 97 12 34 56",
    email: "koffi.amoussou@email.bj",
    location: "Cotonou",
    baccalaureat: {
      serie: "D",
      year: "2025",
      mention: "Assez Bien"
    },
    interests: ["Informatique", "Mathématiques"],
    bio: "Jeune bachelier à la recherche d'une formation en informatique."
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('bac.')) {
      const field = name.split('.')[1];
      setUserData(prev => ({
        ...prev,
        baccalaureat: { ...prev.baccalaureat, [field]: value }
      }));
    } else {
      setUserData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleInterestToggle = (interest) => {
    setUserData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Ici vous pourriez sauvegarder dans une API
    alert("Profil mis à jour !");
  };

  const interestOptions = ["Informatique", "Santé", "Commerce", "Lettres", "Droit", "Économie", "Sciences", "Ingénierie"];

  return (
    <div className="profile-container">
      {/* Bannière simple */}
      <div className="banner">
        <div className="banner-content">
          <h2>Mon Profil d'Orientation</h2>
          <p>Complétez ces informations pour recevoir des suggestions d'orientation</p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="profile-content">
        {/* Avatar et infos principales */}
        <div className="profile-header">
          <div className="avatar-section">
            <div className="avatar">
              {userData.name.charAt(0)}
            </div>
            {!isEditing && (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                ✏️ Modifier
              </button>
            )}
          </div>

          {!isEditing ? (
            // Mode affichage
            <div className="info-display">
              <h1>{userData.name}</h1>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">📅 Âge</span>
                  <span>{userData.age} ans</span>
                </div>
                <div className="info-item">
                  <span className="label">📍 Ville</span>
                  <span>{userData.location}</span>
                </div>
                <div className="info-item">
                  <span className="label">📞 Téléphone</span>
                  <span>{userData.phone}</span>
                </div>
                <div className="info-item">
                  <span className="label">📧 Email</span>
                  <span>{userData.email}</span>
                </div>
                <div className="info-item">
                  <span className="label">🎓 Bac</span>
                  <span>Série {userData.baccalaureat.serie} • {userData.baccalaureat.year} • {userData.baccalaureat.mention}</span>
                </div>
              </div>
              <div className="bio-display">
                <p>{userData.bio}</p>
              </div>
              <div className="interests-display">
                <span className="label">🎯 Centres d'intérêt :</span>
                <div className="interest-tags">
                  {userData.interests.map(interest => (
                    <span key={interest} className="interest-tag">{interest}</span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Mode édition
            <div className="info-edit">
              <h1>Modifier mon profil</h1>
              
              <div className="form-group">
                <label>Nom complet</label>
                <input type="text" name="name" value={userData.name} onChange={handleChange} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Âge</label>
                  <input type="number" name="age" value={userData.age} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Ville</label>
                  <input type="text" name="location" value={userData.location} onChange={handleChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Téléphone</label>
                  <input type="tel" name="phone" value={userData.phone} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={userData.email} onChange={handleChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Série du Bac</label>
                  <select name="bac.serie" value={userData.baccalaureat.serie} onChange={handleChange}>
                    <option value="A">Série A (Lettres)</option>
                    <option value="B">Série B (Sciences sociales)</option>
                    <option value="C">Série C (Maths/Physique)</option>
                    <option value="D">Série D (Sciences nat)</option>
                    <option value="E">Série E (Sciences techniques)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Année du Bac</label>
                  <input type="text" name="bac.year" value={userData.baccalaureat.year} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Mention</label>
                  <select name="bac.mention" value={userData.baccalaureat.mention} onChange={handleChange}>
                    <option value="Passable">Passable</option>
                    <option value="Assez Bien">Assez Bien</option>
                    <option value="Bien">Bien</option>
                    <option value="Très Bien">Très Bien</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Brève présentation (optionnel)</label>
                <textarea name="bio" rows="2" value={userData.bio} onChange={handleChange}></textarea>
              </div>

              <div className="form-group">
                <label>Centres d'intérêt (choisissez 2-3)</label>
                <div className="interests-options">
                  {interestOptions.map(interest => (
                    <button
                      key={interest}
                      type="button"
                      className={`interest-choice ${userData.interests.includes(interest) ? 'selected' : ''}`}
                      onClick={() => handleInterestToggle(interest)}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-cancel" onClick={() => setIsEditing(false)}>Annuler</button>
                <button className="btn-save" onClick={handleSave}>Enregistrer</button>
              </div>
            </div>
          )}
        </div>

        {/* Message d'orientation */}
        {!isEditing && (
          <div className="orientation-card">
            <h3>📌 Suggestions d'orientation</h3>
            <p>Basé sur votre profil (Bac {userData.baccalaureat.serie}, intérêt pour {userData.interests.join(", ")}), voici les formations recommandées :</p>
            <div className="suggestions">
              <div className="suggestion">🎓 Licence en Informatique</div>
              <div className="suggestion">📊 BTS en Développement Web</div>
              <div className="suggestion">💻 Formation en Génie Logiciel</div>
            </div>
            <button className="btn-see-more">Voir toutes les suggestions →</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;