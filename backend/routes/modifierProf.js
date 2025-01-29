const express = require("express");
const db = require("../db/connection");

const router = express.Router();

// Récupérer un professeur par ID
router.get("/:id", (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM Professeurs WHERE id = ?";

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("❌ Erreur SQL :", err);
            return res.status(500).json({ error: "Erreur interne du serveur" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Professeur non trouvé" });
        }

        res.json(results[0]);
    });
});

// Modifier un professeur
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { nom, prenom, email, telephone, matiere, statut } = req.body;

    const query = `
        UPDATE Professeurs 
        SET nom = ?, prenom = ?, email = ?, telephone = ?, matiere = ?, statut = ?
        WHERE id = ?;
    `;

    db.query(query, [nom, prenom, email, telephone, matiere, statut, id], (err, result) => {
        if (err) {
            console.error("❌ Erreur SQL :", err);
            return res.status(500).json({ error: "Erreur interne du serveur" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Professeur non trouvé" });
        }

        res.json({ message: "✅ Mise à jour réussie !" });
    });
});

module.exports = router;

