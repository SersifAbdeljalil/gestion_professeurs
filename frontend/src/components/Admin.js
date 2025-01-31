import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaFileImport, FaPrint, FaSignOutAlt } from "react-icons/fa";
import * as XLSX from "xlsx";

const Admin = () => {
  const [professeurs, setProfesseurs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfesseurs = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/list-professeurs");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des professeurs");
        }
        const data = await response.json();
        setProfesseurs(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des professeurs :", error);
      }
    };
    fetchProfesseurs();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("profId");
    navigate("/");
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(professeurs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Professeurs");
    XLSX.writeFile(workbook, "Liste_Professeurs.xlsx");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Liste des Professeurs</h1>
        <button onClick={handleLogout} style={{ backgroundColor: "red", color: "white", padding: "10px", border: "none", borderRadius: "5px" }}>
          <FaSignOutAlt /> Déconnexion
        </button>
      </div>

      <table border="1" width="100%" cellPadding="10" style={{ marginTop: "20px", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Statut</th>
           
          </tr>
        </thead>
        <tbody>
          {professeurs.map((prof, index) => (
            <tr key={index}>
              <td>{prof.nom}</td>
              <td>{prof.prenom}</td>
              <td>{prof.email}</td>
              <td>{prof.statut}</td>
              
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "15px" }}>
        <Link to="/ajouter-professeur">
          <button style={{ backgroundColor: "#429ebd", color: "white", padding: "10px", border: "none", borderRadius: "5px" }}>
            <FaPlus /> Ajouter Manuellement
          </button>
        </Link>
        <Link to="/importer-prof">
          <button style={{ backgroundColor: "#F7AD19", color: "white", padding: "10px", border: "none", borderRadius: "5px" }}>
            <FaFileImport /> Importer via Excel
          </button>
        </Link>
        <button onClick={handleExportExcel} style={{ backgroundColor: "#4CAF50", color: "white", padding: "10px", border: "none", borderRadius: "5px" }}>
          <FaPrint /> Imprimer (Excel)
        </button>
      </div>
    </div>
  );
};

export default Admin;
