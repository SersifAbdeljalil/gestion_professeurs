const express = require("express");
const db = require("../db/connection");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const router = express.Router();

// Transporteur pour envoyer des emails
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "sersif.a366@ucd.ac.ma", // Remplacez par votre email
        pass: "qrdx rpza ozyf apfg ", // Remplacez par votre mot de passe
    },
});

// Route pour demander un code de réinitialisation
router.post("/request-reset", (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Email requis." });
    }

    const resetCode = crypto.randomInt(100000, 999999); // Générer un code à 6 chiffres

    db.query("SELECT * FROM professeurs WHERE email = ?", [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erreur serveur." });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Email non trouvé." });
        }

        // Mettre à jour la base de données avec le code de réinitialisation
        db.query("UPDATE professeurs SET reset_code = ? WHERE email = ?", [resetCode, email], (updateErr) => {
            if (updateErr) {
                return res.status(500).json({ error: "Erreur lors de la mise à jour." });
            }

            // Envoyer l'email avec le code
            transporter.sendMail({
                from: "sersif.a366@ucd.ac.ma",
                to: email,
                subject: "Code de réinitialisation du mot de passe",
                text: `Votre code de réinitialisation est : ${resetCode}`,
            });

            res.json({ message: "Code envoyé avec succès.", redirect: true });
        });
    });
});


// Route pour vérifier le code de réinitialisation
router.post("/verify-code", (req, res) => {
    const { email, code } = req.body;
    
    db.query("SELECT reset_code FROM professeurs WHERE email = ?", [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erreur serveur." });
        }

        if (results.length === 0 || results[0].reset_code !== parseInt(code)) {
            return res.status(400).json({ error: "Code incorrect." });
        }

        res.json({ message: "Code valide." });
    });
});

// Route pour réinitialiser le mot de passe
router.post("/reset-password", async (req, res) => {
    const { email, code, newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    db.query("SELECT reset_code FROM professeurs WHERE email = ?", [email], (err, results) => {
        if (err || results.length === 0 || results[0].reset_code !== parseInt(code)) {
            return res.status(400).json({ error: "Code invalide." });
        }

        db.query("UPDATE professeurs SET mot_de_passe = ?, reset_code = NULL WHERE email = ?", [hashedPassword, email], (updateErr) => {
            if (updateErr) {
                return res.status(500).json({ error: "Erreur de mise à jour." });
            }
            res.json({ message: "Mot de passe réinitialisé avec succès." });
        });
    });
});

module.exports = router;
