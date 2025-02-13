import React, { useState } from "react";
import { useLocation,Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { FaEye, FaEyeSlash } from "react-icons/fa"; 
import "../styles/ForgotPassword.css"; 
import Header from './Header';
import Footer from './Footer';
import '../styles/Accueil.css';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showPassword, setShowPassword] = useState(false); //  state pour afficher/masquer le mot de passe
    const location = useLocation();
    const email = location.state?.email || "";
    const code = location.state?.code || "";

    const navigate = useNavigate(); 

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await api.post("/password-reset/reset-password", { email, code, newPassword });
        setMessage("Mot de passe réinitialisé avec succès !");
        setTimeout(() => {
            navigate("/"); // Redirection vers la page de connexion
        }, 2000); // Attend 2 secondes pour afficher le message avant de rediriger
    } catch (error) {
        setMessage(error.response?.data.error || "Erreur.");
    }
};

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setNewPassword(password);
        setPasswordStrength(calculatePasswordStrength(password));
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

    return (
        <div className="app-container">
        <Header />
        <main className="login-main">
        <div className="container">
            <div className="Ioverlay-container">
                <div className="overlay">
                    <div className="overlay-panel overlay-left">
                        <h1>Réinitialiser le Mot de Passe</h1>
                        <p>Entrez un nouveau mot de passe pour sécuriser votre compte.</p>
                    </div>
                </div>
            </div>

            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h1>Réinitialiser le Mot de Passe</h1>
                    <div className="infield">
                        <input
                            type={showPassword ? "text" : "password"} // Change le type en fonction de l'état
                            name="mot_de_passe"
                            placeholder="Nouveau mot de passe"
                            value={newPassword}
                            onChange={handlePasswordChange}
                            required
                        />
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
                    <div className="links-container">
                        <Link to="/verify-code" className="link-button">
                            Routour 
                        </Link>
                    </div>
                    <button type="submit" disabled={passwordStrength < 3}>
                        Réinitialiser
                    </button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
        </main>
      <Footer />
    </div>
    );
};

export default ResetPassword;
