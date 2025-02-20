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
    const [phoneError, setPhoneError] = useState("");

    const navigate = useNavigate();

    const validatePhoneNumber = (phone) => {
        const phoneRegex = /^\+212[0-9]{9}$/;
        if (!phone) return true; // Permet un champ vide
        return phoneRegex.test(phone);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === "telephone") {
            let newValue = value;
            // Si l'utilisateur colle ou tape un numéro sans +212
            if (value && !value.startsWith('+212')) {
                // Supprimer tout sauf les chiffres
                const numbers = value.replace(/[^0-9]/g, '');
                // Ajouter +212 au début
                newValue = `+212${numbers}`;
            }
            
            setFormData({ ...formData, telephone: newValue });
            
            if (validatePhoneNumber(newValue)) {
                setPhoneError("");
            } else if (newValue && newValue.length > 0) {
                setPhoneError("Le numéro doit commencer par +212 suivi de 9 chiffres");
            } else {
                setPhoneError("");
            }
        } else if (name === "mot_de_passe") {
            setPasswordStrength(calculatePasswordStrength(value));
            setFormData({ ...formData, [name]: value });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation du numéro de téléphone avant soumission
        if (formData.telephone && !validatePhoneNumber(formData.telephone)) {
            alert("Format de numéro de téléphone invalide");
            return;
        }

        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });
        if (photo) data.append("photo_profil", photo);

        try {
            const response = await api.post("/professeurs", data);
            alert(response.data.message);
            navigate("/admin/professeurs"); // Redirection après succès
        } catch (error) {
            console.error("Erreur :", error);
            alert("Erreur : l'email est déjà associé à un compte.");
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

    const getPasswordStrengthText = () => {
        switch(passwordStrength) {
            case 0:
                return "Très faible";
            case 1:
                return "Faible";
            case 2:
                return "Moyen";
            case 3:
                return "Fort";
            case 4:
                return "Très fort";
            case 5:
                return "Excellent";
            default:
                return "";
        }
    };

    const getPasswordStrengthColor = () => {
        switch(passwordStrength) {
            case 0:
                return "#ff0000";
            case 1:
                return "#ff4500";
            case 2:
                return "#ffa500";
            case 3:
                return "#9acd32";
            case 4:
                return "#32cd32";
            case 5:
                return "#008000";
            default:
                return "#000000";
        }
    };

    return (
        <AdminLayout>
            <div className="Pcontainer">
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-right">
                            <h2>Entrez un nouveau professeur!</h2>
                            
                        </div>
                    </div>
                </div>

                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        <h1>Remplissez le formulaire</h1>
                        
                        <div className="infield">
                            <input 
                                type="text" 
                                name="nom" 
                                placeholder="Nom" 
                                value={formData.nom}
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <div className="infield">
                            <input 
                                type="text" 
                                name="prenom" 
                                placeholder="Prénom" 
                                value={formData.prenom}
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <div className="infield">
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Email" 
                                value={formData.email}
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <div className="infield">
                            <input 
                                type="text" 
                                name="telephone" 
                                placeholder="Téléphone (+212...)" 
                                value={formData.telephone}
                                onChange={handleChange}
                            />
                            {phoneError && (
                                <span className="error-message" style={{
                                    color: 'red',
                                    fontSize: '12px',
                                    marginTop: '5px',
                                    display: 'block'
                                }}>
                                    {phoneError}
                                </span>
                            )}
                        </div>

                        <div className="infield">
                            <input 
                                type="text" 
                                name="matieres" 
                                placeholder="Matières enseignées" 
                                value={formData.matieres}
                                onChange={handleChange} 
                            />
                        </div>

                        <div className="infield">
                            <select 
                                name="statut" 
                                value={formData.statut}
                                onChange={handleChange}
                            >
                                <option value="permanent">Permanent</option>
                                <option value="vacataire">Vacataire</option>
                            </select>
                        </div>

                        <div className="infield password-field">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="mot_de_passe"
                                placeholder="Mot de passe"
                                value={formData.mot_de_passe}
                                onChange={handleChange}
                                required
                            />
                            <div 
                                className="password-icon" 
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ cursor: 'pointer' }}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>

                        <div style={{ 
                            marginTop: '5px', 
                            fontSize: '12px',
                            color: getPasswordStrengthColor() 
                        }}>
                            Force du mot de passe: {getPasswordStrengthText()}
                        </div>

                        <div className="infield">
                            <input 
                                type="file" 
                                onChange={(e) => setPhoto(e.target.files[0])} 
                                accept="image/*" 
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={
                                passwordStrength < 3 || 
                                (formData.telephone && !validatePhoneNumber(formData.telephone))
                            }
                            style={{
                                opacity: (passwordStrength < 3 || 
                                    (formData.telephone && !validatePhoneNumber(formData.telephone))) 
                                    ? 0.5 : 1
                            }}
                            onClick={() => window.location.href = `/Admin`}
                        >
                            Ajouter
                        </button>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AjouterProfesseur;