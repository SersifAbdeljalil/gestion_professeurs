const express = require("express");
const multer = require("multer");
const db = require("../db/connection"); // Connexion à la base de données
const path = require("path");

const router = express.Router();

// Servir les fichiers uploadés
router.use("/uploads", express.static(path.join(__dirname, "../uploads"))); 

// Configurer Multer pour la gestion des fichiers uploadés
const upload = multer({ dest: "uploads/" });

// 🔹 Récupérer les informations d'un professeur
router.get("/:id", (req, res) => {
    const { id } = req.params;

    const query = "SELECT * FROM Professeurs WHERE id = ?";
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("Erreur lors de la récupération :", err);
            return res.status(500).json({ error: "Erreur interne du serveur" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Professeur non trouvé" });
        }

        res.json(results[0]); // Renvoie les informations du professeur
    });
});

// 🔹 Modifier les informations d'un professeur
router.put("/:id", upload.single("photo"), (req, res) => {
    const { id } = req.params;
    const { nom, prenom, email, telephone, matiere, statut } = req.body;
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const query = `
        UPDATE Professeurs
        SET nom = ?, prenom = ?, email = ?, telephone = ?, matiere = ?, statut = ?, photo_profil = COALESCE(?, photo_profil)
        WHERE id = ?
    `;

    db.query(query, [nom, prenom, email, telephone, matiere, statut, photoUrl, id], (err, result) => {
        if (err) {
            console.error("Erreur lors de la mise à jour :", err);
            return res.status(500).json({ error: "Erreur interne du serveur" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Professeur non trouvé" });
        }

        res.json({ message: "Mise à jour réussie !" });
    });

});

module.exports = router;
