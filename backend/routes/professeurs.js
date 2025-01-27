const express = require("express");
const multer = require("multer");
const db = require("../db/connection");

const router = express.Router();

// Configuration de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });

// Route pour ajouter un professeur
router.post("/", upload.single("photo_profil"), (req, res) => {
    const { nom, prenom, email, telephone, matieres, statut } = req.body;
    const photo_profil = req.file ? req.file.filename : null;

    const query = `
        INSERT INTO professeurs (nom, prenom, email, telephone, matieres, statut, photo_profil)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [nom, prenom, email, telephone, matieres, statut, photo_profil];

    db.query(query, values, (err) => {
        if (err) {
            console.error("Erreur lors de l'insertion :", err);
            return res.status(500).json({ error: "Erreur serveur." });
        }
        res.status(201).json({ message: "Professeur ajouté avec succès !" });
    });
});

module.exports = router; // Assurez-vous d'exporter le routeur correctement
