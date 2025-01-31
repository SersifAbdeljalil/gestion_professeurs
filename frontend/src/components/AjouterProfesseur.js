import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importation des icônes
import "../styles/AjouterProfesseur.css";

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
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showPassword, setShowPassword] = useState(false); // Nouveau state pour gérer l'affichage du mot de passe

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "mot_de_passe") {
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

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[@$!%*?&]/.test(password)) strength += 1;
        return strength;
    };

    const getStrengthColor = () => {
        if (passwordStrength <= 1) return "red";
        if (passwordStrength === 2 || passwordStrength === 3) return "orange";
        if (passwordStrength >= 4) return "green";
    };

    const handleRedirect = () => {
        navigate("/login");
    };

    return (
        <div className="container" id="container">
            <div className="overlay-container">
                <div className="overlay">
                    <div className="overlay-panel overlay-left">
                        <h1>Ajout Manuel de Professeurs</h1>
                        <p>Saisissez manuellement les informations pour ajouter des professeurs.</p>
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
                    <div className="infield password-field">
                        <input
                            type={showPassword ? "text" : "password"} // Change le type en fonction de l'état
                            name="mot_de_passe"
                            placeholder="Mot de passe"
                            onChange={handleChange}
                            required
                        />
                        {/* Icône pour afficher/masquer le mot de passe */}
                        <div className="password-icon" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </div>
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
                                    width: `${(passwordStrength / 5) * 100}%`,
                                    backgroundColor: getStrengthColor(),
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
                        <Link to="/Admin" className="link-button">
                            Page Principale 
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
