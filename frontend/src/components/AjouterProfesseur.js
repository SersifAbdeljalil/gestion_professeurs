import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { FaEye, FaEyeSlash } from "react-icons/fa"; 
import "../styles/AjouterProfesseur.css";
import AdminLayout from "../layouts/AdminLayout"; 

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
    const [showPassword, setShowPassword] = useState(false); 

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "mot_de_passe") {
            setPasswordStrength(calculatePasswordStrength(value));
        }
        setFormData({ ...formData, [name]: value });
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

    //  Ajout de la fonction manquante
    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[@$!%*?&]/.test(password)) strength += 1;
        return strength;
    };

    return (
        <AdminLayout>
            <div className="Pcontainer">
                <div className="overlay-container">
                    
                </div>

                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        <h1>Ajouter un Professeur</h1>
                        <div className="infield">
                            <input type="text" name="nom" placeholder="Nom" onChange={handleChange} required />
                        </div>
                        <div className="infield">
                            <input type="text" name="prenom" placeholder="Prénom" onChange={handleChange} required />
                        </div>
                        <div className="infield">
                            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                        </div>
                        <div className="infield">
                            <input type="text" name="telephone" placeholder="Téléphone" onChange={handleChange} />
                        </div>
                        <div className="infield">
                            <input type="text" name="matieres" placeholder="Matières enseignées" onChange={handleChange} />
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
                                type={showPassword ? "text" : "password"}
                                name="mot_de_passe"
                                placeholder="Mot de passe"
                                onChange={handleChange}
                                required
                            />
                            <div className="password-icon" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>

                        <div className="infield">
                            <input type="file" onChange={(e) => setPhoto(e.target.files[0])} accept="image/*" />
                        </div>
                        <button type="submit" disabled={passwordStrength < 3}>Ajouter</button>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AjouterProfesseur;
