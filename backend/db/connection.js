const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", // Remplacez par votre mot de passe MySQL
    database: "gestion_professeurs"
});

db.connect((err) => {
    if (err) {
        console.error("Erreur de connexion à la base de données :", err);
        process.exit(1);
    }
    console.log("Connecté à MySQL !");
});

module.exports = db;
