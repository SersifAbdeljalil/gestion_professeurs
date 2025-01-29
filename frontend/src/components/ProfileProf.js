import React, { useEffect, useState } from "react";

const ProfileProf = () => {
  const profId = localStorage.getItem("profId"); // Récupérer l'ID du professeur connecté
  console.log("🔍 ID du professeur récupéré :", profId);
  const [professeur, setProfesseur] = useState(null);
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    matiere: "",
    statut: "",
    photo: null,
  });

  useEffect(() => {
    if (!profId) return;

    fetch(`http://localhost:3001/api/modifierProf/${profId}`)
      .then((res) => {
        console.log("📡 Réponse HTTP :", res.status); // Vérifier si la requête est bonne
        if (!res.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }
        return res.json();
      })
      .then((data) => {
        setProfesseur(data);
        setForm({ ...data, photo: null }); // Remplir le formulaire
      })
      .catch((err) => console.error("❌ Erreur :", err));
  }, [profId]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value);
    });

    try {
      const response = await fetch(`http://localhost:3001/api/modifierProf/${profId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour.");
      }

      alert("✅ Mise à jour réussie !");
    } catch (error) {
      console.error("❌ Erreur :", error);
      alert("❌ Échec de la mise à jour.");
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
