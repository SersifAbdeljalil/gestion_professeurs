const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db/connection"); // Connexion à la base de données
const professeursRoutes = require("./routes/professeurs"); // Routes des professeurs
const authRoutes = require("./routes/auth"); // Routes d'authentification

const app = express();

// Middlewares globaux
app.use(cors()); // Permettre les requêtes cross-origin
app.use(bodyParser.json()); // Parse les requêtes JSON
app.use("/uploads", express.static("uploads")); // Servir des fichiers statiques (exemple : images)

// Connexion à la base de données
db.connect((err) => {
    if (err) {
        console.error("Erreur de connexion à la base de données :", err);
    } else {
        console.log("Connexion à la base de données réussie !");
    }
});

// Définir les routes
app.use("/api/professeurs", professeursRoutes); // Route pour les professeurs
app.use("/api/auth", authRoutes); // Route pour l'authentification (login)
// app.use("/api/forgotPassword",ForgotPasswordRoutes);
// Port et démarrage du serveur
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
