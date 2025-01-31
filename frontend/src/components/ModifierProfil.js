import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Utilisation de useNavigate et useParams

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
    const navigate = useNavigate(); // Utilisation de useNavigate pour la navigation
    const { id } = useParams(); // Utilisation de useParams pour récupérer l'ID du professeur via les paramètres d'URL

    useEffect(() => {
        // Récupération des informations du professeur pour préremplir le formulaire
        fetch(`http://localhost:3001/api/recupererProf/${id}`)
            .then((response) => response.json())
            .then((data) => setProfesseur(data))
            .catch((error) => console.error("Erreur lors de la récupération des données", error));
    }, [id]);

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

        // Envoi de la requête PUT pour mettre à jour le profil
        fetch(`http://localhost:3001/api/modifierProf/${id}/modifier`, {
            method: "PUT",
            body: formData,
          })
            .then((response) => response.json())
            .then((data) => {
              alert("Mise à jour réussie !");
              
              // Forcer un rechargement des données du profil
              window.location.reload();
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
                <input 
                    type="text" 
                    value={professeur.nom} 
                    onChange={(e) => setProfesseur({ ...professeur, nom: e.target.value })} 
                    placeholder="Nom" 
                />
                <input 
                    type="text" 
                    value={professeur.prenom} 
                    onChange={(e) => setProfesseur({ ...professeur, prenom: e.target.value })} 
                    placeholder="Prénom" 
                />
                <input 
                    type="email" 
                    value={professeur.email} 
                    onChange={(e) => setProfesseur({ ...professeur, email: e.target.value })} 
                    placeholder="Email" 
                />
                <input 
                    type="tel" 
                    value={professeur.telephone} 
                    onChange={(e) => setProfesseur({ ...professeur, telephone: e.target.value })} 
                    placeholder="Téléphone" 
                />
                <input 
                    type="text" 
                    value={professeur.matieres} 
                    onChange={(e) => setProfesseur({ ...professeur, matieres: e.target.value })} 
                    placeholder="Matières" 
                />
                <input 
                    type="text" 
                    value={professeur.statut} 
                    onChange={(e) => setProfesseur({ ...professeur, statut: e.target.value })} 
                    placeholder="Statut" 
                />
                <input 
                    type="file" 
                    onChange={(e) => setPhoto(e.target.files[0])} 
                    accept="image/*" 
                />
                <button type="submit">Mettre à jour</button>
            </form>
        </div>
    );
};

export default ModifierProfil;
