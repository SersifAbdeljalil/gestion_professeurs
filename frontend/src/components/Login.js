import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api"; 
import { FiEye, FiEyeOff } from "react-icons/fi"; 
import "../styles/AjouterProfesseur.css";
import Header from './Header';
import Footer from './Footer';
import '../styles/Accueil.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        mot_de_passe: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Données envoyées:", formData);

        if (formData.email === "admin@admin.com" && formData.mot_de_passe === "admin") {
            localStorage.setItem("profId", 1);
            navigate("/Admin");
            return;
        }

        try {
            const response = await api.post("/auth/login", formData);

            if (response.status === 200) {
                const userData = response.data.user;
                console.log("🔹 Utilisateur connecté :", userData);

                if (userData && userData.id) {
                    localStorage.setItem("profId", userData.id);
                    console.log(" ID stocké :", localStorage.getItem("profId"));

                    if (userData.email === "admin@admin.com") {
                        navigate("/Admin");
                    } else {
                        navigate("/ProfileProf");
                    }
                } else {
                    console.error(" Erreur : ID du professeur non trouvé !");
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

    return (
        <div className="app-container">
        <Header />
        <main className="login-main">
        <div className="container">
            <div className="overlay-container">
                
            </div>

            <div className="form-container">
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
                        <span className="password-icon" onClick={() => setShowPassword(!showPassword)}>
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
        </main>
      <Footer />
    </div>
    );
};

export default Login;
