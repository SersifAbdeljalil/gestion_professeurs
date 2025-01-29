import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AjouterProfesseur from "./components/AjouterProfesseur";
import Login from "./components/Login";
import ProfileProf from "./components/ProfileProf";

const App = () => {
  const [teacherId, setTeacherId] = useState(2); // Exemple d'ID d'un professeur (à remplacer par votre logique)

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/ajouter-professeur" element={<AjouterProfesseur />} />
          <Route path="/profile" element={<ProfileProf teacherId={teacherId} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
