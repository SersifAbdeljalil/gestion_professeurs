const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db/connection");
const professeursRoutes = require("./routes/professeurs");
const authRoutes = require("./routes/auth");
const modifierRoutes = require("./routes/modifierProf");
//const cartesRoutes = require("./routes/cartes");

const app = express();

// Middlewares globaux
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// Connexion à la base de données
db.connect((err) => {
    if (err) {
        console.error("Erreur de connexion à la base de données :", err);
        process.exit(1);
    }
    console.log("Connexion à la base de données réussie !");
});

// Définir les routes
app.use("/api/professeurs", professeursRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/modifierProf", modifierRoutes);
//app.use("/api/cartes", cartesRoutes);
// Port et démarrage du serveur
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
