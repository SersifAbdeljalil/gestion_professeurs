import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Correct import des composants
import AjouterProfesseur from "./components/AjouterProfesseur"; // Assurez-vous que le chemin est correct
import Login from "./components/Login"; // Assurez-vous que le chemin est correct
import ProfileProf from "./components/ProfileProf"

const App = () => (
    <Router> {/* Ajouter le Router pour la gestion des routes */}
        <div>
            <Routes>
                {/* Définir la route principale (accueil) comme la page de connexion */}
                <Route path="/" element={<Login />} /> {/* Route principale */}
                
                {/* Autres routes */}
                <Route path="/ajouter-professeur" element={<AjouterProfesseur />} /> {/* Route pour ajouter un professeur */}
                <Route path="/ProfileProf" element={<ProfileProf />} />
            </Routes>
        </div>
    </Router>
);

export default App;
