import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "../styles/ForgotPassword.css"; // Importation du style commun

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/password-reset/request-reset", { email });

            if (response.data.redirect) {
                navigate("/verify-code", { state: { email } }); // Redirection vers VerifyCode avec email
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            setMessage(error.response?.data.error || "Erreur.");
        }
    };

    return (
        <div className="container">
            <div className="overlay-container">
                <div className="overlay">
                    <h1>Mot de passe oublié</h1>
                    <p>Entrez votre email pour recevoir un code de réinitialisation.</p>
                </div>
            </div>

            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h1>Réinitialisation du mot de passe</h1>
                    <div className="infield">
                        <input
                            type="email"
                            placeholder="Entrez votre email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="links-container">
                        <Link to="/" className="link-button">
                            Routour a la page de connexion
                        </Link>
                    </div>
                    <button type="submit">Envoyer le code</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default ForgotPassword;
