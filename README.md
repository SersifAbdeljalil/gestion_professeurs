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

     node server.js
