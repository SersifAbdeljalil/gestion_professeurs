const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const validator = require("validator");
const fs = require("fs");
const path = require("path");
const db = require("../db/connection");

const router = express.Router();

// Assurer que le dossier "uploads" existe
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration de `multer`
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Route pour ajouter un professeur
router.post("/", upload.single("photo_profil"), async (req, res) => {
    const { nom, prenom, email, telephone, matieres, statut, mot_de_passe } = req.body;
    const photo_profil = req.file ? `/uploads/${req.file.filename}` : null;

    // Vérifications
    if (!nom || !prenom || !email || !statut || !mot_de_passe) {
        return res.status(400).json({ error: "Tous les champs obligatoires doivent être remplis." });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Email invalide." });
    }
    if (mot_de_passe.length < 8) {
        return res.status(400).json({ error: "Le mot de passe doit contenir au moins 8 caractères." });
    }

    try {
        // Vérifier si l'email existe déjà
        const [existingUser] = await db.promise().query("SELECT * FROM professeurs WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: "Un professeur avec cet email existe déjà." });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

        // Insérer dans la base de données
        const query = `
            INSERT INTO professeurs (nom, prenom, email, telephone, matieres, statut, photo_profil, mot_de_passe)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [nom, prenom, email, telephone, matieres, statut, photo_profil, hashedPassword];

        const [result] = await db.promise().query(query, values);
        console.log(" Professeur ajouté avec succès :", result);

        res.status(201).json({ message: "Professeur ajouté avec succès !" });
    } catch (err) {
        console.error(" Erreur lors de l'ajout du professeur :", err);
        res.status(500).json({ error: "Erreur serveur lors de l'ajout du professeur." });
    }
});

module.exports = router;
