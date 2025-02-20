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
    fs.mkdirSync(tempPath, { recursive: true });
}

const CONFIG = {
    CARD_WIDTH: 400,
    CARD_HEIGHT: 250,
    BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
    API_URL: process.env.API_URL || 'http://localhost:3001',
    COLORS: {
        background: "#004d40",
        accent: "#996515",
        white: "#FFFFFF"
    }
};

async function generateCardContent(doc, professeur, isFirstPage = true) {
    if (!isFirstPage) {
        doc.addPage();
    }

    // Background
    doc.rect(0, 0, CONFIG.CARD_WIDTH, CONFIG.CARD_HEIGHT)
       .fill(CONFIG.COLORS.background);

    // Diagonal accent
    doc.save()
       .moveTo(250, 0)
       .lineTo(CONFIG.CARD_WIDTH, 0)
       .lineTo(CONFIG.CARD_WIDTH, 100)
       .fill(CONFIG.COLORS.accent);

    // White center rectangle - garde la position originale
    doc.rect(50, 70, 250, 40)
       .fill(CONFIG.COLORS.white);

    // Logo
    const logoPath = path.join(imagesPath, "FS.png");
    if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 20, 15, {
            width: 40,
            height: 40
        });
    }

    // Header text
    doc.font("Helvetica-Bold")
       .fontSize(14)
       .fillColor(CONFIG.COLORS.white)
       .text("Faculté des sciences", 70, 15)
       .fontSize(12)
       .text("El jadida", 70, 35);

    // UCD centré dans le triangle
    doc.fontSize(14)
       .text("UCD", 300, 30, { 
           width: 80,
           align: 'center'
       });

    // Professor details
    doc.fontSize(12)
       .text(`${professeur.nom} ${professeur.prenom}`, 20, 130);

    // Titre ENSEIGNANT CHERCHEUR - même position qu'avant
    doc.font("Helvetica-Bold")
       .fontSize(16)
       .fillColor(CONFIG.COLORS.background)
       .text("ENSEIGNANT CHERCHEUR", 70, 80);

    doc.font("Helvetica")
       .fontSize(12)
       .fillColor(CONFIG.COLORS.white)
       .text(`Département: ${professeur.departement || "Informatique"}`, 20, 150);

    // Generate and add QR Code - placé avant les informations de contact
    try {
        const qrCodeData = `${CONFIG.BASE_URL}/ProfileProf/${professeur.id}`;
        const qrCodeImage = await QRCode.toDataURL(qrCodeData);
        doc.image(qrCodeImage, 20, 170, {
            width: 35,
            height: 35
        });
    } catch (error) {
        console.error("QR Code generation error:", error);
    }

    // Contact information - après le QR code
    doc.fontSize(10)
       .text(professeur.telephone || "+212 xxx xxx xxx", 70, 170)
       .text(professeur.email, 70, 185)
       .text("www.fs.ucd.ac.ma", 70, 200);

    // Photo du professeur
    const photoX = 280;
    const photoY = 130;
    const photoSize = 80;

    if (professeur.photo_profil) {
        let tempPhotoPath = null;
        try {
            const imageUrl = `${CONFIG.API_URL}${professeur.photo_profil}`;
            const response = await axios({
                method: "get",
                url: imageUrl,
                responseType: "arraybuffer",
                timeout: 5000
            });

            tempPhotoPath = path.join(tempPath, `prof_${professeur.id}_photo_${Date.now()}.jpg`);
            fs.writeFileSync(tempPhotoPath, response.data);

            doc.image(tempPhotoPath, photoX, photoY, {
                width: photoSize,
                height: photoSize,
                fit: [photoSize, photoSize]
            });

            fs.unlink(tempPhotoPath, err => {
                if (err) console.error("Error deleting temp file:", err);
            });
        } catch (error) {
            console.error("Error processing professor photo:", error);
            // Si erreur lors du chargement de la photo, afficher le cadre blanc
            doc.rect(photoX, photoY, photoSize, photoSize)
               .fill(CONFIG.COLORS.white);
        }
    } else {
        // Afficher le cadre blanc uniquement s'il n'y a pas de photo
        doc.rect(photoX, photoY, photoSize, photoSize)
           .fill(CONFIG.COLORS.white);
    }

    // Bottom bar
    doc.rect(0, CONFIG.CARD_HEIGHT - 30, CONFIG.CARD_WIDTH, 30)
       .fillColor(CONFIG.COLORS.accent)
       .fill();
    
    
}

// Routes restent identiques
router.get("/:id/generate-pdf", async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: "Invalid professor ID" });
        }

        const [results] = await db.promise().query("SELECT * FROM Professeurs WHERE id = ?", [id]);

        if (!results || results.length === 0) {
            return res.status(404).json({ error: "Professeur non trouvé" });
        }

        const doc = new PDFDocument({
            size: [CONFIG.CARD_WIDTH, CONFIG.CARD_HEIGHT],
            margins: { top: 0, bottom: 0, left: 0, right: 0 }
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition", 
            `attachment; filename=carte_${results[0].nom}_${results[0].prenom}.pdf`
        );

        doc.pipe(res);
        await generateCardContent(doc, results[0]);
        doc.end();

    } catch (error) {
        console.error("PDF generation error:", error);
        res.status(500).json({ error: "Erreur lors de la génération de la carte" });
    }
});

router.get("/generate-all-cards", async (req, res) => {
    try {
        const [results] = await db.promise().query("SELECT * FROM Professeurs");

        if (!results || results.length === 0) {
            return res.status(404).json({ error: "Aucun professeur trouvé" });
        }

        const doc = new PDFDocument({
            size: [CONFIG.CARD_WIDTH, CONFIG.CARD_HEIGHT],
            margins: { top: 0, bottom: 0, left: 0, right: 0 }
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=toutes_les_cartes.pdf");

        doc.pipe(res);

        for (let i = 0; i < results.length; i++) {
            await generateCardContent(doc, results[i], i === 0);
        }

        doc.end();

    } catch (error) {
        console.error("PDF generation error:", error);
        res.status(500).json({ error: "Erreur lors de la génération des cartes" });
    }
});

module.exports = router;