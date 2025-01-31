const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const bcrypt = require("bcrypt");
const validator = require("validator");
const db = require("../db/connection");

const router = express.Router();

// Configuration de multer pour l'upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route pour importer un fichier Excel et ajouter plusieurs professeurs
router.post("/", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "Aucun fichier envoyé." });
    }

    try {
        const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        if (data.length === 0) {
            return res.status(400).json({ error: "Le fichier est vide." });
        }

        const requiredFields = ["nom", "prenom", "email", "statut", "mot_de_passe"];
        let errors = [];

        // Vérification des données
        for (const [index, row] of data.entries()) {
            for (const field of requiredFields) {
                if (!row[field]) {
                    errors.push(`Ligne ${index + 2}: Champ manquant (${field})`);
                }
            }

            // Validation de l'email
            if (row.email && !validator.isEmail(row.email)) {
                errors.push(`Ligne ${index + 2}: Email invalide (${row.email})`);
            }
            // Validation du mot de passe
            if (row.mot_de_passe && row.mot_de_passe.length < 8) {
                errors.push(`Ligne ${index + 2}: Mot de passe trop court (minimum 8 caractères)`);
            }

            // Validation du statut
            if (row.statut && !['permanent', 'vacataire'].includes(row.statut)) {
                errors.push(`Ligne ${index + 2}: Statut invalide (${row.statut}). Doit être 'permanent' ou 'vacataire'`);
            }
        }

        if (errors.length > 0) {
            return res.status(400).json({ error: "Erreurs de validation", details: errors });
        }

        // Vérifier si certains emails existent déjà
        const emails = data.map((prof) => prof.email);
        const [existingUsers] = await db.promise().query(
            `SELECT email FROM professeurs WHERE email IN (?)`, [emails]
        );
        const existingEmails = existingUsers.map(user => user.email);

        if (existingEmails.length > 0) {
            return res.status(400).json({ error: "Certains emails existent déjà", existingEmails });
        }

        // Hashage des mots de passe et préparation des données
        const values = await Promise.all(
            data.map(async ({ nom, prenom, email, telephone, matieres, statut, mot_de_passe }) => {
                const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
                return [nom, prenom, email, telephone || "", matieres || "", statut, "", hashedPassword];
            })
        );

        // Insertion des professeurs
        const sql = `
            INSERT INTO professeurs (nom, prenom, email, telephone, matieres, statut, photo_profil, mot_de_passe)
            VALUES ?
        `;
        await db.promise().query(sql, [values]);

        res.status(201).json({ message: "Importation réussie !", count: values.length });

    } catch (error) {
        console.error("Erreur d'importation :", error);
        res.status(500).json({ error: "Erreur serveur", details: error.message });
    }
});

module.exports = router;
