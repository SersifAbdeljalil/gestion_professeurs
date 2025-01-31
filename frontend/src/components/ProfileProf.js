import React, { useEffect, useState } from "react";
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
  //fonction pour deconnexion
  const handleLogout = () => {
    localStorage.removeItem("profId"); // Supprime l'ID stocké
    window.location.href = "/"; // Redirige vers la page de connexion
  };
  

  if (!professeur) return <p>Chargement...</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          {/* Image de profil */}
          <img
  src={professeur.photo_profil ? `http://localhost:3001/uploads/${professeur.photo_profil}?t=${new Date().getTime()}` : "/default-profile.png"}
  alt="Profile"
  className="profile-photo"
/>



          {/* Bouton Modifier Profil */}
          <button
            className="edit-profile-btn"
            onClick={() => window.location.href = `/ModifierProfil/${profId}`}
          >
            Modifier Profil
          </button>
        </div>

        <h2>Mon Profil</h2>
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

        {/* Lien pour générer la carte professionnelle */}
        <h3>Carte Professionnelle</h3>
        <div className="profile-info">
          <div className="profile-field">
            <a
              href={`http://localhost:3001/api/cartes/${profId}/generate-pdf`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Générer ma carte professionnelle
            </a>
          </div>
        </div>

        {/*deconnexipon*/}
        <button className="logout-btn" onClick={handleLogout}> Déconnexion</button>
      </div>
    </div>
    
  );
};

export default ProfileProf;
