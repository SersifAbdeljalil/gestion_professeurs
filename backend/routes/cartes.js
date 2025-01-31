const express = require("express");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const db = require("../db/connection");
const axios = require("axios");
const fs = require("fs");

const router = express.Router();

console.log("✅ La route /api/cartes est bien chargée !");

router.get("/:id/generate-pdf", async (req, res) => {
    console.log(`📌 Route appelée avec ID : ${req.params.id}`);
    const { id } = req.params;

    const query = "SELECT * FROM Professeurs WHERE id = ?";
    db.query(query, [id], async (err, results) => {
        if (err) {
            console.error("❌ Erreur SQL :", err);
            return res.status(500).json({ error: "Erreur interne du serveur" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Professeur non trouvé" });
        }

        const professeur = results[0];

        // Génération du QR Code
        const qrCodeData = `http://localhost:3000/ProfileProf/${id}`;
        const qrCodeImage = await QRCode.toDataURL(qrCodeData);

        // Création du PDF
        const doc = new PDFDocument({ size: "A4" }); // Format A4
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=professeur_${id}.pdf`);

        doc.pipe(res);

        // Dimensions et positions
        const margin = 50;
        const photoX = margin; // Position X de la photo (gauche)
        const photoY = margin; // Position Y de la photo (haut)
        const qrX = 400; // Position X du QR Code (droite)
        const qrY = margin; // Position Y du QR Code (haut)
        const textX = margin + 120; // Décalage pour éviter chevauchement avec l'image

        // Photo du professeur en haut à gauche
        if (professeur.photo_profil) {
            const imageUrl = `http://localhost:3001${professeur.photo_profil}`;

            // Télécharger l'image avec axios
            axios({
                method: "get",
                url: imageUrl,
                responseType: "arraybuffer",
            })
            .then(response => {
                fs.writeFileSync("prof_photo.jpg", response.data);

                // Ajouter la photo
                doc.image("prof_photo.jpg", photoX, photoY, { width: 100, height: 100 });

                // Ajouter les informations du professeur
                doc.fontSize(20).text(`Nom: ${professeur.nom}`, textX, photoY + 10);
                doc.text(`Prénom: ${professeur.prenom}`, textX, photoY + 40);
                doc.fontSize(15).text(`Matière enseignée: ${professeur.matieres}`, textX, photoY + 70);

                // Ajouter le QR Code en haut à droite
                doc.image(qrCodeImage, qrX, qrY, { width: 100, height: 100 });

                doc.end();
            })
            .catch(error => {
                console.error("❌ Erreur lors du téléchargement de l'image :", error);
                doc.end();
            });
        } else {
            // Si pas de photo, on met directement le texte et le QR Code
            doc.fontSize(20).text(`Nom: ${professeur.nom}`, textX, photoY + 10);
            doc.text(`Prénom: ${professeur.prenom}`, textX, photoY + 40);
            doc.fontSize(15).text(`Matière enseignée: ${professeur.matieres}`, textX, photoY + 70);

            // QR Code en haut à droite
            doc.image(qrCodeImage, qrX, qrY, { width: 100, height: 100 });

            doc.end();
        }
    });
});

module.exports = router;
