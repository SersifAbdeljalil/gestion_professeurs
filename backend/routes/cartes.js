const express = require("express");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const db = require("../db/connection");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const imagesPath = path.join(__dirname, "../../frontend/src/images");
const tempPath = path.join(__dirname, "..", "temp");

if (!fs.existsSync(tempPath)) {
    fs.mkdirSync(tempPath);
}

router.get("/:id/generate-pdf", async (req, res) => {
    const { id } = req.params;
    let tempPhotoPath = null;

    try {
        const query = "SELECT * FROM Professeurs WHERE id = ?";
        const [results] = await new Promise((resolve, reject) => {
            db.query(query, [id], (err, results) => {
                if (err) reject(err);
                else resolve([results]);
            });
        });

        if (results.length === 0) {
            return res.status(404).json({ error: "Professeur non trouvé" });
        }

        const professeur = results[0];

        // Génération du QR Code
        const qrCodeData = `http://localhost:3000/ProfileProf/${id}`;
        const qrCodeImage = await QRCode.toDataURL(qrCodeData);

        const doc = new PDFDocument({
            size: [400, 250],
            margins: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            }
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition", 
            `attachment; filename=carte_${professeur.nom}_${professeur.prenom}.pdf`
        );

        doc.pipe(res);

        // Fond vert foncé
        doc.rect(0, 0, 400, 250).fill("#004d40");

        // Section dorée en diagonal (triangle)
        doc.save()
           .moveTo(250, 0)
           .lineTo(400, 0)
           .lineTo(400, 100)
           .fill("#996515");

        // Rectangle blanc central plus petit
        doc.rect(50, 70, 300, 50)
           .fill("#FFFFFF");

        // Logo en haut à gauche
        const logoPath = path.join(imagesPath, "FS.png");
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, 20, 15, {
                width: 40,
                height: 40
            });
        }

        // Titre de l'établissement
        doc.font("Helvetica-Bold")
           .fontSize(14)
           .fillColor("#FFFFFF")
           .text("FACULTY OF SCIENCES", 70, 15)
           .fontSize(12)
           .text("EL JADIDA", 70, 35)
           .text("MOROCCO", 280, 15, { align: 'right' });

        // Nom et prénom
        doc.fontSize(12)
           .fillColor("#FFFFFF")
           .text(`${professeur.nom} ${professeur.prenom}`, 20, 130);

        // Titre "ENSEIGNANT CHERCHEUR"
        doc.font("Helvetica-Bold")
           .fontSize(18)
           .fillColor("#004d40")
           .text("ENSEIGNANT CHERCHEUR", 70, 80);

        // Département
        doc.font("Helvetica")
           .fontSize(12)
           .fillColor("#FFFFFF")
           .text(`Département: ${professeur.departement || "Informatique"}`, 20, 150);

        // Informations de contact
        doc.fontSize(10)
           .fillColor("#FFFFFF")
           .text(`${professeur.telephone || "+212 xxx xxx xxx"}`, 20, 170)
           .text(`${professeur.email}`, 20, 185)
           .text("www.fs.ucd.ac.ma", 20, 200);

        // Logo dans la zone centrale
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, 280, 75, {
                width: 30,
                height: 30
            });
        }

        // QR Code - Position ajustée
        doc.image(qrCodeImage, 70, 210, {  
            width: 35,
            height: 35
        });

        // Photo du professeur
        if (professeur.photo_profil) {
            try {
                const imageUrl = `http://localhost:3001${professeur.photo_profil}`;
                const response = await axios({
                    method: "get",
                    url: imageUrl,
                    responseType: "arraybuffer"
                });

                tempPhotoPath = path.join(tempPath, `prof_${id}_photo.jpg`);
                fs.writeFileSync(tempPhotoPath, response.data);

                doc.image(tempPhotoPath, 280, 130, {
                    width: 80,
                    height: 80,
                    fit: [80, 80]
                });
            } catch (error) {
                console.error("Erreur lors du téléchargement de la photo :", error);
            }
        }

        // Code-barres en bas
        doc.rect(120, 220, 260, 20)  // Adjusted width and position to accommodate QR code
           .fillColor("#000000")
           .fill();
        
        doc.font("Helvetica")
           .fontSize(10)
           .fillColor("#FFFFFF")
           .text("EL JADIDA", 120, 225, {  // Adjusted position to match new rectangle
               width: 260,
               align: "center"
           });

        // Finaliser le PDF
        doc.end();

        // Nettoyer le fichier temporaire après l'envoi
        if (tempPhotoPath) {
            doc.on('end', () => {
                fs.unlink(tempPhotoPath, (err) => {
                    if (err) console.error("Erreur lors de la suppression du fichier temporaire:", err);
                });
            });
        }

    } catch (error) {
        console.error("Erreur lors de la génération du PDF:", error);
        res.status(500).json({ error: "Erreur lors de la génération de la carte" });
        
        if (tempPhotoPath && fs.existsSync(tempPhotoPath)) {
            fs.unlinkSync(tempPhotoPath);
        }
    }
});

module.exports = router;