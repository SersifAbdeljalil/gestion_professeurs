// ForgotPassword.js
import React, { useState } from "react";
import api from "../services/api";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/auth/forgot-password", { email });
            setMessage(response.data.message);
        } catch (error) {
            setMessage("Erreur: " + (error.response?.data?.error || "Impossible de traiter la demande."));
        }
    };

    return (
        <div>
            <h2>Mot de passe oublié</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <button type="submit">Envoyer</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ForgotPassword;