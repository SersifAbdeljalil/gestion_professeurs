import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileProf = ({ teacherId }) => {
    const [teacher, setTeacher] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    // Charger les informations du professeur
    useEffect(() => {
        axios.get(`http://localhost:3000/professeurs/${teacherId}`)
            .then(response => {
                setTeacher(response.data);
                setError(null);
            })
            .catch(err => {
                setError("Erreur lors du chargement des données.");
                console.error(err);
            });
    }, [teacherId]);

    // Gérer le changement de champs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTeacher({ ...teacher, [name]: value });
    };

    // Gérer le téléversement de fichier
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // Sauvegarder les modifications
    const handleSave = () => {
        if (!teacher.nom || !teacher.prenom || !teacher.email) {
            alert("Veuillez remplir tous les champs obligatoires.");
            return;
        }

        setIsSaving(true);
        const formData = new FormData();
        Object.entries(teacher).forEach(([key, value]) => {
            formData.append(key, value);
        });
        if (selectedFile) {
            formData.append('photo', selectedFile);
        }

        axios.put(`http://localhost:3000/professeurs/${teacherId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then(() => {
                setIsSaving(false);
                setIsEditing(false);
                alert('Mise à jour réussie !');
            })
            .catch(error => {
                setIsSaving(false);
                console.error('Erreur lors de la mise à jour :', error);
            });
    };

    if (!teacher || Object.keys(teacher).length === 0) {
        return <p>Chargement des données...</p>;
    }

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
            <div>
                <img
                    src={teacher.photo_profil ? `http://localhost:3000${teacher.photo_profil}` : 'https://via.placeholder.com/150'}
                    alt="Photo de profil"
                    className="w-32 h-32 rounded-full mx-auto"
                />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {isEditing ? (
                <>
                    <input
                        type="text"
                        name="nom"
                        value={teacher.nom || ''}
                        onChange={handleChange}
                        placeholder="Nom"
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="prenom"
                        value={teacher.prenom || ''}
                        onChange={handleChange}
                        placeholder="Prénom"
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="email"
                        name="email"
                        value={teacher.email || ''}
                        onChange={handleChange}
                        placeholder="Email"
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="telephone"
                        value={teacher.telephone || ''}
                        onChange={handleChange}
                        placeholder="Téléphone"
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="matiere"
                        value={teacher.matiere || ''}
                        onChange={handleChange}
                        placeholder="Matière"
                        className="w-full p-2 border rounded"
                    />
                    <select
                        name="statut"
                        value={teacher.statut || ''}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="permanent">Permanent</option>
                        <option value="vacataire">Vacataire</option>
                    </select>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="w-full p-2 border rounded"
                    />
                    <button
                        onClick={handleSave}
                        className={`bg-blue-500 text-white px-4 py-2 rounded ${isSaving && "opacity-50 cursor-not-allowed"}`}
                        disabled={isSaving}
                    >
                        {isSaving ? "Enregistrement..." : "Sauvegarder"}
                    </button>
                </>
            ) : (
                <>
                    <h2 className="text-lg font-bold">{`${teacher.nom} ${teacher.prenom}`}</h2>
                    <p>Email : {teacher.email}</p>
                    <p>Téléphone : {teacher.telephone}</p>
                    <p>Matière(s) : {teacher.matiere}</p>
                    <p>Statut : {teacher.statut}</p>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Modifier
                    </button>
                </>
            )}
        </div>
    );
};

export default ProfileProf;
