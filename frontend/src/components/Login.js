import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api"; // Assurez-vous que api.js est correctement configuré
import "./AjouterProfesseur.css";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        mot_de_passe: ""
    });
    const navigate = useNavigate();

    // Fonction pour mettre à jour l'état des champs de formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Fonction de gestion de l'envoi du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Données envoyées:", formData); // Vérification des données envoyées

        try {
            const response = await api.post("/auth/login", formData); // Correction de l'endpoint ici

            // Vérification de la réponse du serveur
            if (response.status === 200) {
                const userData = response.data.user;
                console.log("🔹 Utilisateur connecté :", userData); // Vérifier ce que le backend renvoie

                if (userData && userData.id) {
                    localStorage.setItem("profId", userData.id); // Stocker l'ID du professeur
                    console.log("✅ ID stocké :", localStorage.getItem("profId")); // Vérifier si l'ID est bien enregistré
                } else {
                    console.error("❌ Erreur : ID du professeur non trouvé !");
                }

                navigate("/ProfileProf");
            } else {
                alert("Email ou mot de passe incorrect.");
            }
        } catch (error) {
            const errorMessage = error.response ? error.response.data.error : error.message;
            console.error("Erreur de connexion :", errorMessage);
            alert(errorMessage || "Erreur lors de la connexion.");
        }
    };

    return (
        <div className="container" id="container">
            <div className="overlay-container">
                <div className="overlay">
                    <div className="overlay-panel overlay-left">
                        <h1>Bienvenue</h1>
                        <p>Connectez-vous pour accéder à votre tableau de bord.</p>
                    </div>
                </div>
            </div>

            <div className="form-container sign-up-container">
                <form onSubmit={handleSubmit}>
                    <h1>Connexion</h1>
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
                            type="password"
                            name="mot_de_passe"
                            placeholder="Mot de passe"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="links-container">
                        <Link to="/ajouter-professeur" className="link-button">
                            S'inscrire !
                        </Link>
                    </div>
                    <button type="submit">Se connecter</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
