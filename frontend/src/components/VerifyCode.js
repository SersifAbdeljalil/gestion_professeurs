import React, { useState } from "react";
import { useNavigate, useLocation ,Link} from "react-router-dom";
import api from "../services/api";
import "../styles/ForgotPassword.css"; 
import Header from './Header';
import Footer from './Footer';
import '../styles/Accueil.css';
const VerifyCode = () => {
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/password-reset/verify-code", { email, code });
            navigate("/reset-password", { state: { email, code } }); // Redirection vers ResetPassword
        } catch (error) {
            setMessage(error.response?.data.error || "Code invalide.");
        }
    };

    return (
        <div className="app-container">
        <Header />
        <main className="login-main">
        <div className="container">
            <div className="Ioverlay-container">
                <div className="overlay">
                    <h1>Vérifier le Code</h1>
                    <p>Entrez le code à 6 chiffres que vous avez reçu pour réinitialiser votre mot de passe.</p>
                </div>
            </div>

            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h1>Vérifier le Code</h1>
                    <div className="infield">
                        <input
                            type="text"
                            placeholder="Code à 6 chiffres"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                        />
                    </div>
                       <div className="links-container">
                                            <Link to="/forgot-password" className="link-button">
                                                Routour
                                            </Link>
                                        </div>
                    <button type="submit">Vérifier</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
        </main>
      <Footer />
    </div>
    );
};

export default VerifyCode;
