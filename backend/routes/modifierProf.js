const express = require("express");
const db = require("../db/connection"); 
const path = require("path");
const multer = require("multer");

const router = express.Router();

//  Configuration de multer pour l'upload des fichiers
const storage = multer.diskStorage({
    destination: "./uploads/", 
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage }); // Définition de `upload`

// Route pour modifier le profil d'un professeur
router.put("/:id/modifier", upload.single("photo"), (req, res) => {
    const { id } = req.params;
    const { nom, prenom, email, telephone, matieres, statut } = req.body;
    const photo_profil = req.file ? `/uploads/${req.file.filename}` : null;

    if (!nom || !prenom || !email || !telephone) {
        return res.status(400).json({ error: "Tous les champs sont requis !" });
    }

    const updateQuery = `
        UPDATE Professeurs 
        SET nom = ?, prenom = ?, email = ?, telephone = ?, matieres = ?, statut = ?, photo_profil = COALESCE(?, photo_profil)
        WHERE id = ?
    `;

    db.query(updateQuery, [nom, prenom, email, telephone, matieres, statut, photo_profil, id], (err, result) => {
        if (err) {
            console.error("❌ Erreur SQL :", err);
            return res.status(500).json({ error: "Erreur serveur" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Professeur non trouvé" });
        }

        res.json({ message: "Profil mis à jour avec succès !" });
    });
});

module.exports = router;
