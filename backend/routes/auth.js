const express = require("express");
const bcrypt = require("bcrypt"); // Utilisation de bcrypt pour vérifier le mot de passe
const db = require("../db/connection"); // Connexion à la base de données

const router = express.Router();

// Route de connexion (login)
router.post("/login", async (req, res) => {
    const { email, mot_de_passe } = req.body;

    // Vérifier si l'email et le mot de passe sont fournis
    if (!email || !mot_de_passe) {
        return res.status(400).json({ error: "Email et mot de passe sont requis." });
    }

    try {
        // Chercher l'utilisateur par email dans la base de données
        const query = "SELECT * FROM professeurs WHERE email = ?";
        db.query(query, [email], async (err, results) => {
            if (err) {
                console.error("Erreur lors de la requête :", err);
                return res.status(500).json({ error: "Erreur serveur." });
            }

            // Vérifier si un utilisateur a été trouvé
            if (results.length === 0) {
                return res.status(404).json({ error: "Email non trouvé." });
            }

            const user = results[0]; // Obtenir les données de l'utilisateur

            // Comparer le mot de passe fourni avec le mot de passe haché dans la base de données
            const isPasswordCorrect = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

            if (isPasswordCorrect) {
                // Connexion réussie
                return res.status(200).json({ 
                    message: "Connexion réussie !", 
                    user: { id: user.id, email: user.email, nom: user.nom } 
                });
            } else {
                // Mot de passe incorrect
                return res.status(401).json({ error: "Mot de passe incorrect." });
            }
        });
    } catch (err) {
        console.error("Erreur lors de la connexion :", err);
        res.status(500).json({ error: "Erreur serveur." });
    }
});

module.exports = router;
