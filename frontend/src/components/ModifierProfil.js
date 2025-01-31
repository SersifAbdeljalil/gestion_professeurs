import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ModifierProfil.css"; 

const ModifierProfil = () => {
    const [professeur, setProfesseur] = useState({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        matieres: "",
        statut: "",
        photo: null
    });
    const [photo, setPhoto] = useState(null);
    const navigate = useNavigate();

    // 🔹 Récupération de l'ID du professeur connecté depuis localStorage
    const profId = localStorage.getItem("profId");

    useEffect(() => {
        if (!profId) {
            alert("Erreur : utilisateur non connecté.");
            navigate("/"); // Redirection vers la connexion si l'ID est manquant
            return;
        }

        fetch(`http://localhost:3001/api/recupererProf/${profId}`)
            .then((response) => response.json())
            .then((data) => setProfesseur(data))
            .catch((error) => console.error("Erreur lors de la récupération des données", error));
    }, [profId, navigate]);

    const handleUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (professeur.nom) formData.append("nom", professeur.nom);
        if (professeur.prenom) formData.append("prenom", professeur.prenom);
        if (professeur.email) formData.append("email", professeur.email);
        if (professeur.telephone) formData.append("telephone", professeur.telephone);
        if (professeur.matieres) formData.append("matieres", professeur.matieres);
        if (professeur.statut) formData.append("statut", professeur.statut);
        if (photo) formData.append("photo", photo);

        fetch(`http://localhost:3001/api/modifierProf/${profId}/modifier`, {
            method: "PUT",
            body: formData,
        })
        .then((response) => response.json())
        .then(() => {
            alert("Mise à jour réussie !");
            navigate("/ProfileProf"); // 🔹 Redirection vers la page de profil après modification
        })
        .catch((error) => {
            console.error("Erreur lors de la mise à jour du profil", error);
            alert("Erreur lors de la mise à jour");
        });
    }

    return (
        <div className="modifier-profile">
            <h1>Modifier le profil de {professeur.nom} {professeur.prenom}</h1>
            <form onSubmit={handleUpdate}>
                <input type="text" value={professeur.nom} onChange={(e) => setProfesseur({ ...professeur, nom: e.target.value })} placeholder="Nom" />
                <input type="text" value={professeur.prenom} onChange={(e) => setProfesseur({ ...professeur, prenom: e.target.value })} placeholder="Prénom" />
                <input type="email" value={professeur.email} onChange={(e) => setProfesseur({ ...professeur, email: e.target.value })} placeholder="Email" />
                <input type="tel" value={professeur.telephone} onChange={(e) => setProfesseur({ ...professeur, telephone: e.target.value })} placeholder="Téléphone" />
                <input type="text" value={professeur.matieres} onChange={(e) => setProfesseur({ ...professeur, matieres: e.target.value })} placeholder="Matières" />
                <input type="text" value={professeur.statut} onChange={(e) => setProfesseur({ ...professeur, statut: e.target.value })} placeholder="Statut" />
                <input type="file" onChange={(e) => setPhoto(e.target.files[0])} accept="image/*" />
                
                <button type="submit">Mettre à jour</button>
                
                <a href="#" className="retour-link" onClick={() => navigate(-1)}>Retour</a>
            </form>
        </div>
    );
};

export default ModifierProfil;
