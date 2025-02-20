const express = require("express");
const db = require("../db/connection");
const path = require("path");
const bcrypt = require("bcrypt");
const multer = require("multer");

const router = express.Router();

router.use(express.json()); 
router.use(express.urlencoded({ extended: true }));

// Configuration de multer pour l'upload
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

// Route pour modifier le profil d'un professeur
router.put("/:id/modifier", upload.single("photo"), async (req, res) => {
    const { id } = req.params;
    const { nom, prenom, email, telephone, matieres, statut, currentPassword, newPassword } = req.body;
    const photo_profil = req.file ? `/uploads/${req.file.filename}` : null;

    console.log("Requête reçue :", req.body);

    if (!nom || !prenom || !email || !telephone) {
        return res.status(400).json({ error: "Tous les champs sont requis !" });
    }

    try {
        if (currentPassword && newPassword) {
            const [user] = await db.promise().query("SELECT mot_de_passe FROM Professeurs WHERE id = ?", [id]);
            if (!user.length) return res.status(404).json({ error: "Professeur non trouvé" });

            console.log("Mot de passe en BD :", user[0].mot_de_passe);

            const isPasswordValid = await bcrypt.compare(currentPassword, user[0].mot_de_passe);
            console.log("Mot de passe valide ?", isPasswordValid);

            if (!isPasswordValid) return res.status(400).json({ error: "Le mot de passe actuel est incorrect" });

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await db.promise().query("UPDATE Professeurs SET mot_de_passe = ? WHERE id = ?", [hashedPassword, id]);
        }

        await db.promise().query("UPDATE Professeurs SET nom = ?, prenom = ?, email = ?, telephone = ?, matieres = ?, statut = ?, photo_profil = COALESCE(?, photo_profil) WHERE id = ?", [nom, prenom, email, telephone, matieres, statut, photo_profil, id]);

        res.json({ message: "Profil mis à jour avec succès !" });
    } catch (error) {
        console.error("Erreur SQL :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});


module.exports = router;
