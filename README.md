## Guide d'installation et de lancement du projet

## Étapes pour lancer le projet

1. Préparation du projet

-Créez un dossier pour le projet et ouvrez-le dans le terminal ou dans votre IDE.

-Clonez le projet depuis GitHub en exécutant la commande suivante :

**git init**
**git clone https://github.com/Abdo28102002/gestion_professeurs**

2. Installation des dépendances

Une fois le projet cloné :

Ouvrez le projet dans votre IDE préféré.

Accédez au dossier frontend dans le terminal :

**cd frontend**

Installez toutes les dépendances nécessaires :

**npm install**

Une fois l'installation terminée, lancez le projet avec :

**npm start**

3. Lancement du serveur backend

-Ouvrez un nouveau terminal pour éviter les conflits avec le frontend.

-Assurez-vous qu'aucun autre serveur n'est déjà lancé sur le port 3001.

Lancez le serveur backend :

**cd backend**
**node server.js**

4. Création de la base de données

-Dans votre système de gestion de base de données, créez une base nommée "**gestion_professeurs**".

-Accédez à la base de données "**gestion_professeurs**" et importez le fichier gestion_professeurs.sql qui se trouve dans le projet installé ou sur le dépôt GitHub.

-Une fois l'importation terminée, la base de données contiendra toutes les informations nécessaires pour tester l'application.

## Fonctionnalités de l'application

**En tant qu'Administrateur**

-authentification  en tant qu'admin (E-mail : **admin@admin.com**, Mot de passe : **admin**).

-Page d'accueil affichant la liste complète des professeurs avec leurs informations.

-Impression des cartes professionnelles des professeurs.

-Importation d'une liste de professeurs.

-Ajout manuel d'un professeur.

**En tant que Professeur**

-Consulter et modifier ses informations personnelles.

-Imprimer sa carte professionnelle.

-Changer son mot de passe.

