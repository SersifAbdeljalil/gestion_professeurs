import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AjouterProfesseur from "./components/AjouterProfesseur";
import Login from "./components/Login";
import ProfileProf from "./components/ProfileProf";
import ModifierProfil from "./components/ModifierProfil";
import Admin from "./components/Admin";
import ImporterProfesseurs from "./components/ImporterProfesseurs";
import ForgotPassword from "./components/ForgotPassword";
import VerifyCode from "./components/VerifyCode";
import ResetPassword from "./components/ResetPassword";



const App = () => {
  const [teacherId, setTeacherId] = useState(null);

  useEffect(() => {
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
          <Route path="/ProfileProf" element={<ProfileProf />} />
          <Route path="/modifierProfil/:id" element={<ModifierProfil />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/importer-prof" element={<ImporterProfesseurs />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
