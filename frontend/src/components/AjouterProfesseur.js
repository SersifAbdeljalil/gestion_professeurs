import React, { useState } from "react";
import api from "../services/api";

const AjouterProfesseur = () => {
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        matieres: "",
        statut: "permanent",
    });
    const [photo, setPhoto] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
            alert("Erreur lors de l'ajout du professeur.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="nom" placeholder="Nom" onChange={handleChange} required />
            <input type="text" name="prenom" placeholder="Prénom" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="text" name="telephone" placeholder="Téléphone" onChange={handleChange} />
            <input type="text" name="matieres" placeholder="Matières enseignées" onChange={handleChange} />
            <select name="statut" onChange={handleChange}>
                <option value="permanent">Permanent</option>
                <option value="vacataire">Vacataire</option>
            </select>
            <input type="file" onChange={handleFileChange} />
            <button type="submit">Ajouter</button>
        </form>
    );
};

export default AjouterProfesseur;
