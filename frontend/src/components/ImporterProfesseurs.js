import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import './AjouterProfesseur.css'; // Import du fichier CSS

const ImporterProfesseurs = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Veuillez sélectionner un fichier.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("http://localhost:3001/api/importer-professeurs", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMessage(response.data.message);
            setErrors([]);
        } catch (error) {
            setMessage(error.response?.data?.error || "Erreur lors de l'import.");
            setErrors(error.response?.data?.details || []);
        }
    };

    const goBack = () => {
        navigate(-1); // Retour à la page précédente
    };

    return (
        <div className="container">
            <div className="overlay-container">
                <div className="overlay">
                    <h1>Importation de Professeurs</h1>
                    <p>Importez un fichier Excel pour ajouter des professeurs.</p>
                </div>
            </div>
            <div className="form-container">
                <button className="back-button" onClick={goBack}>
                    <FaArrowLeft /> Retour
                </button>
                <form>
                    <h1>Importer un fichier</h1>
                    <div className="infield">
                        <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} />
                    </div>
                    <div className="infield">
                        <button type="button" onClick={handleUpload}>Importer</button>
                    </div>
                    {message && <p style={{ color: message.includes("Erreur") ? "red" : "green" }}>{message}</p>}
                    {errors.length > 0 && (
                        <ul style={{ color: "red" }}>
                            {errors.map((err, index) => (
                                <li key={index}>{err}</li>
                            ))}
                        </ul>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ImporterProfesseurs;
