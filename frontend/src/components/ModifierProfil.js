import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa"; 
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

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [photo, setPhoto] = useState(null);
    const [showPasswords, setShowPasswords] = useState(false);
    const navigate = useNavigate();

    const profId = localStorage.getItem("profId");

    useEffect(() => {
        if (!profId) {
            alert("Erreur : utilisateur non connecté.");
            navigate("/");
            return;
        }

        fetch(`http://localhost:3001/api/recupererProf/${profId}`)
            .then((response) => response.json())
            .then((data) => setProfesseur(data))
            .catch((error) => console.error("Erreur lors de la récupération des données", error));
    }, [profId, navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("nom", professeur.nom);
        formData.append("prenom", professeur.prenom);
        formData.append("email", professeur.email);
        formData.append("telephone", professeur.telephone);
        formData.append("matieres", professeur.matieres);
        formData.append("statut", professeur.statut);
        if (photo) formData.append("photo", photo);

        // Gestion des mots de passe
        if (passwords.newPassword || passwords.confirmPassword || passwords.currentPassword) {
            if (passwords.newPassword !== passwords.confirmPassword) {
                alert("Les nouveaux mots de passe ne correspondent pas !");
                return;
            }
            if (passwords.newPassword.length < 6) {
                alert("Le nouveau mot de passe doit contenir au moins 6 caractères !");
                return;
            }
            formData.append("currentPassword", passwords.currentPassword);
            formData.append("newPassword", passwords.newPassword);
        }

        console.log("Données envoyées :", Object.fromEntries(formData));

        try {
            const response = await fetch(`http://localhost:3001/api/modifierProf/${profId}/modifier`, {
                method: "PUT",
                body: formData,
            });

            const result = await response.json();
            console.log("Réponse serveur :", result);

            if (response.ok) {
                alert("Mise à jour réussie !");
                navigate("/ProfileProf");
            } else {
                alert(result.error || "Erreur lors de la mise à jour");
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour du profil", error);
            alert("Erreur lors de la mise à jour");
        }
    };

    return (
<div className="modifier-profile">
    <FaArrowLeft className="back-arrow" onClick={() => navigate(-1)} />
    <h1>Modifier le profil de {professeur.nom} {professeur.prenom}</h1>
    
    <form onSubmit={handleUpdate}>
        <div className="input-group">
            <input type="text" value={professeur.nom} onChange={(e) => setProfesseur({ ...professeur, nom: e.target.value })} placeholder="Nom" />
            <input type="text" value={professeur.prenom} onChange={(e) => setProfesseur({ ...professeur, prenom: e.target.value })} placeholder="Prénom" />
        </div>
        
        <div className="input-group">
            <input type="email" value={professeur.email} onChange={(e) => setProfesseur({ ...professeur, email: e.target.value })} placeholder="Email" />
            <input type="tel" value={professeur.telephone} onChange={(e) => setProfesseur({ ...professeur, telephone: e.target.value })} placeholder="Téléphone" />
        </div>
        
        <div className="input-group">
            <input type="text" value={professeur.matieres} onChange={(e) => setProfesseur({ ...professeur, matieres: e.target.value })} placeholder="Matières" />
            <input type="text" value={professeur.statut} onChange={(e) => setProfesseur({ ...professeur, statut: e.target.value })} placeholder="Statut" />
        </div>

        <input type="file" onChange={(e) => setPhoto(e.target.files[0])} accept="image/*" />

        <div className="password-section">
            <h3>Modifier le mot de passe</h3>
            <div className="password-input">
                        <input 
                            type={showPasswords ? "text" : "password"} 
                            placeholder="Mot de passe actuel" 
                            value={passwords.currentPassword} 
                            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} 
                        />
                        {showPasswords ? <FaEyeSlash onClick={() => setShowPasswords(false)} /> : <FaEye onClick={() => setShowPasswords(true)} />}
                    </div>

                    <div className="password-input">
                        <input 
                            type={showPasswords ? "text" : "password"} 
                            placeholder="Nouveau mot de passe" 
                            value={passwords.newPassword} 
                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} 
                        />
                        {showPasswords ? <FaEyeSlash onClick={() => setShowPasswords(false)} /> : <FaEye onClick={() => setShowPasswords(true)} />}
                    </div>

                    <div className="password-input">
                        <input 
                            type={showPasswords ? "text" : "password"} 
                            placeholder="Confirmer le nouveau mot de passe" 
                            value={passwords.confirmPassword} 
                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} 
                        />
                        {showPasswords ? <FaEyeSlash onClick={() => setShowPasswords(false)} /> : <FaEye onClick={() => setShowPasswords(true)} />}
                    </div>
                </div>
                <div className="button-group">
    <button type="button" onClick={() => navigate(-1)}>Annuler</button>
    <button type="submit">Mettre à jour</button>
</div>
            </form>
        </div>
    );
};

export default ModifierProfil;
