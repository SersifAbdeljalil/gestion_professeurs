const express = require("express");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const db = require("../db/connection");

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
        const qrCodeData = `http://localhost:3000/profile/${id}`;
        const qrCodeImage = await QRCode.toDataURL(qrCodeData);

        // Création du PDF
        const doc = new PDFDocument();
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=professeur_${id}.pdf`);

        doc.pipe(res);
        doc.fontSize(25).text("Carte Professeur", { align: "center" }).moveDown();
        doc.fontSize(20).text(`Nom: ${professeur.nom}`);
        doc.fontSize(20).text(`Prénom: ${professeur.prenom}`);
        doc.fontSize(20).text(`Email: ${professeur.email}`);
        doc.image(qrCodeImage, { fit: [100, 100], align: "center" });

        doc.end();
    });
});

module.exports = router;
