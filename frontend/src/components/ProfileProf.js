import React, { useEffect, useState } from "react";

const ProfileProf = () => {
  const profId = localStorage.getItem("profId"); // Récupérer l'ID stocké après connexion
  const [professeur, setProfesseur] = useState(null);
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    matiere: "",
    statut: "",
    photo: null, // Ajouter un état pour gérer la photo
  });

  useEffect(() => {
    if (!profId) return;
    
    fetch(`http://localhost:3001/api/professeurs/${profId}`)
      .then((res) => res.json())
      .then((data) => {
        setProfesseur(data);
        setForm(data); // Remplir le formulaire avec les données récupérées
      })
      .catch((err) => console.error("Erreur :", err));
  }, [profId]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm({ ...form, photo: files[0] }); // Gérer le fichier photo
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nom", form.nom);
    formData.append("prenom", form.prenom);
    formData.append("email", form.email);
    formData.append("telephone", form.telephone);
    formData.append("matiere", form.matiere);
    formData.append("statut", form.statut);
    if (form.photo) formData.append("photo", form.photo); // Ajouter la photo au FormData

    try {
      const response = await fetch(`http://localhost:3001/api/professeurs/${profId}`, {
        method: "PUT",
        body: formData, // Envoyer FormData au lieu de JSON
      });

      if (response.ok) {
        alert("Mise à jour réussie !");
      } else {
        alert("Erreur lors de la mise à jour.");
      }
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  return (
    <div>
      <h2>Profil du Professeur</h2>
      {professeur ? (
        <form onSubmit={handleUpdate}>
          <input type="text" name="nom" value={form.nom} onChange={handleChange} placeholder="Nom" required />
          <input type="text" name="prenom" value={form.prenom} onChange={handleChange} placeholder="Prénom" required />
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
          <input type="text" name="telephone" value={form.telephone} onChange={handleChange} placeholder="Téléphone" required />
          <input type="text" name="matiere" value={form.matiere} onChange={handleChange} placeholder="Matière" required />
          <input type="text" name="statut" value={form.statut} onChange={handleChange} placeholder="Statut" required />
          <input type="file" name="photo" onChange={handleChange} />
          <button type="submit">Mettre à jour</button>
        </form>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
};

export default ProfileProf;
