import React, { useState } from "react";
import { useNavigate,Link } from "react-router-dom"; // Importation de useNavigate
import api from "../services/api";
import "./AjouterProfesseur.css";

const AjouterProfesseur = () => {
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        matieres: "",
        statut: "permanent",
        mot_de_passe: "",
    });
    const [photo, setPhoto] = useState(null);

    const [passwordStrength, setPasswordStrength] = useState(0); // Force du mot de passe

    const navigate = useNavigate(); // Initialisation de useNavigate

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "mot_de_passe") {
            // Calculer la force du mot de passe
            const strength = calculatePasswordStrength(value);
            setPasswordStrength(strength);
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });
        if (photo) data.append("photo_profil", photo);

        try {
            const response = await api.post("/professeurs", data);
            alert(response.data.message);
        } catch (error) {
            console.error("Erreur :", error);
            alert("Changer l'email déjà associé à un compte.");
        }
    };

    // Fonction pour calculer la force du mot de passe
    const calculatePasswordStrength = (password) => {
        let strength = 0;

        // Ajouter des points selon des critères
        if (password.length >= 8) strength += 1; // Longueur minimale
        if (/[A-Z]/.test(password)) strength += 1; // Une majuscule
        if (/[a-z]/.test(password)) strength += 1; // Une minuscule
        if (/[0-9]/.test(password)) strength += 1; // Un chiffre
        if (/[@$!%*?&]/.test(password)) strength += 1; // Un caractère spécial

        return strength;
    };

    // Fonction pour obtenir la couleur selon la force
    const getStrengthColor = () => {
        if (passwordStrength <= 1) return "red"; // Faible
        if (passwordStrength === 2 || passwordStrength === 3) return "orange"; // Moyen
        if (passwordStrength >= 4) return "green"; // Fort
    };

    const handleRedirect = () => {
        navigate("/login"); // Redirection vers la page de connexion
    };

    return (
        <div className="container" id="container">
            <div className="overlay-container">
                <div className="overlay">
                    <div className="overlay-panel overlay-left">
                        <h1>Bienvenue !</h1>
                       
                    </div>
                </div>
            </div>

            <div className="form-container sign-up-container">
                <form onSubmit={handleSubmit}>
                    <h1>Ajouter un Professeur</h1>
                    <div className="infield">
                        <input
                            type="text"
                            name="nom"
                            placeholder="Nom"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="infield">
                        <input
                            type="text"
                            name="prenom"
                            placeholder="Prénom"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="infield">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="infield">
                        <input
                            type="text"
                            name="telephone"
                            placeholder="Téléphone"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="infield">
                        <input
                            type="text"
                            name="matieres"
                            placeholder="Matières enseignées"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="infield">
                        <select name="statut" onChange={handleChange}>
                            <option value="permanent">Permanent</option>
                            <option value="vacataire">Vacataire</option>
                        </select>
                    </div>

                    {/* Champ mot de passe */}
                    <div className="infield">
                        <input
                            type="password"
                            name="mot_de_passe"
                            placeholder="Mot de passe"
                            onChange={handleChange}
                            required
                        />
                        {/* Barre de progression */}
                        <div
                            style={{
                                height: "5px",
                                width: "100%",
                                backgroundColor: "#e0e0e0",
                                marginTop: "5px",
                            }}
                        >
                            <div
                                style={{
                                    height: "100%",
                                    width: `${(passwordStrength / 5) * 100}%`, // Calcul de la largeur
                                    backgroundColor: getStrengthColor(), // Couleur dynamique
                                    transition: "width 0.3s ease",
                                }}
                            ></div>
                        </div>
                        <small
                            style={{
                                color: getStrengthColor(),
                            }}
                        >
                            {passwordStrength <= 1
                                ? "Mot de passe faible"
                                : passwordStrength === 2 || passwordStrength === 3
                                ? "Mot de passe moyen"
                                : "Mot de passe fort"}
                        </small>
                    </div>

                    <div className="infield">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                    </div>
                    <div className="links-container">
                        <Link to="/" className="link-button">
                            Se Connecter!
                        </Link>
                    </div>
                    <button type="submit" disabled={passwordStrength < 3}>
                        Ajouter
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AjouterProfesseur;
