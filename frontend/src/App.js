import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AjouterProfesseur from "./components/AjouterProfesseur";
import Login from "./components/Login";
import ProfileProf from "./components/ProfileProf";

const App = () => {
  const [teacherId, setTeacherId] = useState(null);

  useEffect(() => {
    // Récupérer l'ID du professeur depuis localStorage après la connexion
    const storedTeacherId = localStorage.getItem("profId");
    if (storedTeacherId) {
      setTeacherId(storedTeacherId);
    }
  }, []);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/ajouter-professeur" element={<AjouterProfesseur />} />
          {/* Passer le teacherId récupéré dynamiquement dans ProfileProf */}
          <Route path="/ProfileProf" element={<ProfileProf />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
