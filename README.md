Étapes pour lancer le projet
1. Créer un dossier pour le projet et l'ouvrir dans le terminal ou dans IDE .
2. Cloner le projet depuis GitHub :
   - Tapez la commande suivante dans le terminal :
  
     git init
     git clone https://github.com/Abdo28102002/gestion_professeurs

3. Installer les dépendances une fois le projet cloné :
   a) Ouvrez le projet dans votre IDE préféré.
   b) Dans le terminal, allez dans le dossier frontend :

     cd frontend

   c) Installez toutes les dépendances nécessaires en exécutant :

     npm install

      Une fois l'installation terminée, lancez le projet avec :

     npm start

4. Lancer le serveur backend :
   a) Ouvrez un nouveau terminal pour éviter les conflits avec le frontend.
   b) Assurez-vous qu'aucun autre serveur n'est déjà lancé sur le port `3001`.
   c) Lancez le serveur backend en exécutant :
     1) cd backend 
     2) node server.js
########pour cote base de donnees voici la requet utiliser :######
CREATE DATABASE IF NOT EXISTS gestion_professeurs;
USE gestion_professeurs;

CREATE TABLE IF NOT EXISTS professeurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telephone VARCHAR(15),
    matieres TEXT,
    statut ENUM('permanent', 'vacataire') NOT NULL,
    photo_profil VARCHAR(255),
    mot_de_passe VARCHAR(255) NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reset_code INT NULL
);

