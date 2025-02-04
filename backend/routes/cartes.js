const express = require("express");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const db = require("../db/connection");
const axios = require("axios");
const fs = require("fs");

const router = express.Router();

console.log("La route /api/cartes est bien chargée !");

router.get("/:id/generate-pdf", async (req, res) => {
    console.log(`Route appelée avec ID : ${req.params.id}`);
    const { id } = req.params;

    const query = "SELECT * FROM Professeurs WHERE id = ?";
    db.query(query, [id], async (err, results) => {
        if (err) {
            console.error("Erreur SQL :", err);
            return res.status(500).json({ error: "Erreur interne du serveur" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Professeur non trouvé" });
        }

        const professeur = results[0];

        // Génération du QR Code
        const qrCodeData = `http://localhost:3000/ProfileProf/${id}`;
        const qrCodeImage = await QRCode.toDataURL(qrCodeData);

        // Création du PDF avec une taille de carte de crédit standard (85.6 x 53.98 mm)
        const doc = new PDFDocument({
            size: [242.65, 153.37], // Conversion de mm en points (1 point = 0.3528 mm)
            margins: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10
            }
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=carte_${professeur.nom}_${professeur.prenom}.pdf`);

        doc.pipe(res);

        // Fond de la carte
        doc.rect(0, 0, 242.65, 153.37).fill("#FFFFFF");

        // Bande décorative en haut
        doc.rect(0, 0, 242.65, 30).fill("#8B4513");

        // Titre de l'établissement en blanc sur la bande marron
        doc.font("Helvetica-Bold")
           .fontSize(14)
           .fillColor("#FFFFFF")
           .text("Université Chouaib Doukkali", 10, 10, {
               align: "center",
               width: 222.65
           });

        if (professeur.photo_profil) {
            const imageUrl = `http://localhost:3001${professeur.photo_profil}`;

            try {
                const response = await axios({
                    method: "get",
                    url: imageUrl,
                    responseType: "arraybuffer"
                });

                fs.writeFileSync("prof_photo.jpg", response.data);

                // Photo du professeur (cercle)
                doc.save()
                   .circle(70, 80, 30)
                   .clip()
                   .image("prof_photo.jpg", 40, 50, {
                       width: 60,
                       height: 60
                   })
                   .restore();

                // Informations du professeur
                doc.font("Helvetica-Bold")
                   .fontSize(12)
                   .fillColor("#333333")
                   .text(`${professeur.prenom} ${professeur.nom}`, 110, 50);

                doc.font("Helvetica")
                   .fontSize(10)
                   .fillColor("#666666")
                   .text("Professeur", 110, 65)
                   .text(professeur.matieres, 110, 80);

                // QR Code en bas à droite
                doc.image(qrCodeImage, 170, 85, {
                    width: 50,
                    height: 50
                });

                // Date d'émission (à la place de l'ID)
                const date = new Date().toLocaleDateString('fr-FR');
                doc.font("Helvetica")
                   .fontSize(8)
                   .fillColor("#999999")
                   .text(`Émise le: ${date}`, 10, 130);

                // Bordure de la carte
                doc.rect(0, 0, 242.65, 153.37)
                   .strokeColor("#8B4513")
                   .strokeOpacity(0.5)
                   .stroke();

            } catch (error) {
                console.error("Erreur lors du téléchargement de l'image :", error);
            }
        } else {
            // Version sans photo
            // ... (même mise en page mais avec un placeholder pour la photo)
        }

        doc.end();
    });
});

module.exports = router;