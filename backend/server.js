const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const db = require("./db/connection");

const professeursRoutes = require("./routes/professeurs");
const authRoutes = require("./routes/auth");
const modifierRoutes = require("./routes/modifierProf");
const cartesRoutes = require("./routes/cartes");
const recupererRoutes = require("./routes/recupererProf");
const listProfesseursRoutes = require("./routes/listProfesseur");
const importerProfesseursRoutes = require("./routes/importerProfesseurs");
const app = express();

// Configuration de Multer pour gérer l'upload des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Dossier où stocker les fichiers
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// Middlewares globaux
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connexion à la base de données
db.connect((err) => {
    if (err) {
        console.error("❌ Erreur de connexion à la base de données :", err);
        process.exit(1);
    }
    console.log("✅ Connexion à la base de données réussie !");
});

// Définir les routes avec middleware d'upload
app.use("/api/professeurs", professeursRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/modifierProf", modifierRoutes); // Cette route va maintenant gérer les uploads correctement
app.use("/api/cartes", cartesRoutes);
app.use("/api/recupererProf", recupererRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/importer-professeurs", importerProfesseursRoutes);
app.use("/api/list-professeurs", listProfesseursRoutes);

// Port et démarrage du serveur
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
