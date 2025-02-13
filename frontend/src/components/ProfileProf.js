import React, { useEffect, useState } from "react";
import { LogOut, Edit, CreditCard } from "lucide-react";
import "../styles/ProfileProf.css";

const ProfileProf = () => {
  const profId = localStorage.getItem("profId");
  const [professeur, setProfesseur] = useState(null);

  useEffect(() => {
    if (!profId) return;
    fetch(`http://localhost:3001/api/recupererProf/${profId}`)
      .then((res) => res.json())
      .then((data) => setProfesseur(data))
      .catch((err) => console.error("Erreur :", err));
  }, [profId]);

  const handleLogout = () => {
    localStorage.removeItem("profId");
    window.location.href = "/";
  };

  if (!professeur) return <p>Chargement...</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="header-container">
            <h2 className="profile-title">Bienvenue </h2>
            <div className="header-buttons">
              <button
                className="icon-button"
                onClick={() => window.location.href = `/ModifierProfil/${profId}`}
                title="Modifier Profil"
              >
                <Edit size={20} />
              </button>
              <button
                className="icon-button"
                onClick={handleLogout}
                title="Déconnexion"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
          <img
            src={`http://localhost:3001${professeur.photo_profil}` || "/default-profile.png"}
            alt="Profile"
            className="profile-photo"
          />
        </div>

        <div className="profile-info">
          <div className="profile-field">
            <label>Nom:</label>
            <span>{professeur.nom}</span>
          </div>
          <div className="profile-field">
            <label>Prénom:</label>
            <span>{professeur.prenom}</span>
          </div>
          <div className="profile-field">
            <label>Téléphone:</label>
            <span>{professeur.telephone}</span>
          </div>
          <div className="profile-field">
            <label>Email:</label>
            <span>{professeur.email}</span>
          </div>
          <div className="profile-field">
            <label>Matières enseignées:</label>
            <span>{professeur.matieres}</span>
          </div>
          <div className="profile-field">
            <label>Statut:</label>
            <span>{professeur.statut}</span>
          </div>
        </div>

        <div className="professional-card-section">
          <div className="card-title">
            <CreditCard size={20} className="card-icon" />
            <span>Carte Professionnelle</span>
          </div>
          <div className="card-preview">
            <div className="preview-info">
              <p className="preview-name">{professeur.prenom} {professeur.nom}</p>
              <p className="preview-title">Professeur</p>
              <p className="preview-subject">{professeur.matieres}</p>
            </div>
          </div>
          <a
            href={`http://localhost:3001/api/cartes/${profId}/generate-pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="download-card-button"
          >
            Télécharger ma carte
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfileProf;