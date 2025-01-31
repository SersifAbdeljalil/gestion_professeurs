const express = require("express");
const validator = require("validator");

const db = require("../db/connection");

const router = express.Router();

/**
 * 📌 Récupérer un professeur par ID
 */
router.get("/:id", (req, res) => {
    const { id } = req.params;

    // Vérifier si l'ID est un entier valide
    if (!validator.isInt(String(id), { min: 1 })) {
        return res.status(400).json({ error: "ID invalide." });
    }

    const query = "SELECT * FROM Professeurs WHERE id = ?";

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("❌ Erreur SQL :", err);
            return res.status(500).json({ error: "Erreur interne du serveur" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Professeur non trouvé" });
        }

        console.log("📡 Professeur récupéré :", results[0]);
        res.json(results[0]);
    });
});


module.exports = router;
