const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const validator = require("validator");
const db = require("../db/connection");

const router = express.Router();

// Configuration de multer pour gérer les fichiers (photo de profil)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        const validExtensions = /jpeg|jpg|png|gif/;
        const isValid = validExtensions.test(file.mimetype);
        cb(isValid ? null : "Erreur : Seuls les fichiers images sont autorisés.", isValid);
    }
});

// Route pour ajouter un professeur
router.post("/", upload.single("photo_profil"), async (req, res) => {
    const { nom, prenom, email, telephone, matieres, statut, mot_de_passe } = req.body;
    const photo_profil = req.file ? req.file.filename : null;

    // Vérifications de base
    if (!nom || !prenom || !email || !statut || !mot_de_passe) {
        return res.status(400).json({ error: "Tous les champs obligatoires doivent être remplis." });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Email invalide." });
    }
    if (mot_de_passe.length < 8) {
        return res.status(400).json({ error: "Le mot de passe doit faire au moins 8 caractères." });
    }

    // Vérification si l'email existe déjà
    try {
        const [existingUser] = await db.promise().query("SELECT * FROM professeurs WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: "Un utilisateur avec cet email existe déjà." });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

        // Insertion du professeur dans la base de données
        const query = `
            INSERT INTO professeurs (nom, prenom, email, telephone, matieres, statut, photo_profil, mot_de_passe)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [nom, prenom, email, telephone, matieres, statut, photo_profil, hashedPassword];

        const [result] = await db.promise().query(query, values);
        console.log("Professeur ajouté avec succès. Résultat : ", result);

        // Retourner une réponse réussie
        res.status(201).json({ message: "Professeur ajouté avec succès !" });
    } catch (err) {
        console.error("Erreur lors de l'ajout du professeur :", err);
        res.status(500).json({ error: "Erreur serveur lors de l'ajout du professeur. Détails: " + err.message });
    }
});

module.exports = router;
