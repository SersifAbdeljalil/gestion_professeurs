const express = require("express");
const db = require("../db/connection");

const router = express.Router();

// Récupérer un professeur par ID
router.get("/", (req, res) => {
    const query = "SELECT * FROM Professeurs";

    db.query(query, (err, results) => {
        // Gestion des erreurs SQL
        if (err) {
            console.error("Erreur SQL :", err);
            return res.status(500).json({ error: "Erreur interne du serveur" });
        }

        // Si aucun professeur n'est trouvé dans la base de données
        if (results.length === 0) {
            return res.status(404).json({ error: "Aucun professeur trouvé" });
        }

        // Si des professeurs sont trouvés, les renvoyer dans la réponse
        res.status(200).json(results);
    });
});




module.exports = router;

