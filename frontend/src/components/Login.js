import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api"; // Assurez-vous que api.js est correctement configuré
import { FiEye, FiEyeOff } from "react-icons/fi"; // Importer les icônes
import "./AjouterProfesseur.css";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        mot_de_passe: ""
    });
    const [showPassword, setShowPassword] = useState(false); // État pour basculer l'affichage du mot de passe
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

        // Vérifier si l'email et le mot de passe sont ceux de l'admin
        if (formData.email === "admin@admin.com" && formData.mot_de_passe === "admin") {
            localStorage.setItem("profId", 1); // ID fictif pour admin
            navigate("/Admin"); // Rediriger vers Admin.js
            return; // Empêche la soumission du formulaire normal
        }

        try {
            const response = await api.post("/auth/login", formData);

            if (response.status === 200) {
                const userData = response.data.user;
                console.log("🔹 Utilisateur connecté :", userData);

                if (userData && userData.id) {
                    localStorage.setItem("profId", userData.id);
                    console.log("✅ ID stocké :", localStorage.getItem("profId"));

                    if (userData.email === "admin@admin.com") {
                        navigate("/Admin");
                    } else {
                        navigate("/ProfileProf");
                    }
                } else {
                    console.error("❌ Erreur : ID du professeur non trouvé !");
                }
            } else {
                alert("Email ou mot de passe incorrect.");
            }
        } catch (error) {
            const errorMessage = error.response ? error.response.data.error : error.message;
            console.error("Erreur de connexion :", errorMessage);
            alert(errorMessage || "Erreur lors de la connexion.");
        }
    };

    // Fonction pour basculer l'affichage du mot de passe
    const togglePassword = () => {
        setShowPassword(!showPassword);
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
                    <div className="infield password-field">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="mot_de_passe"
                            placeholder="Mot de passe"
                            onChange={handleChange}
                            required
                        />
                        <span className="password-toggle" onClick={togglePassword}>
                            {showPassword ? <FiEyeOff /> : <FiEye />} 
                        </span>
                    </div>
                    <div className="links-container">
                        <Link to="/forgot-password" className="link-button">
                            Mot de passe oublié ?
                        </Link>
                
                    </div>
                    <button type="submit">Se connecter</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
