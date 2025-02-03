import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { FaPrint } from "react-icons/fa"; // Import de l'icône
import AdminLayout from "../layouts/AdminLayout"; // Import du layout

const Admin = () => {
  const [professeurs, setProfesseurs] = useState([]);

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

  // Fonction d'exportation vers Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(professeurs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Professeurs");
    XLSX.writeFile(workbook, "Liste_Professeurs.xlsx");
  };

  return (
    <AdminLayout>
      <h1>Liste des Professeurs</h1>
      
      {/* Tableau des professeurs */}
      <div className="table-container">
        <table className="prof-table">
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
      </div>

      {/* Bouton d'exportation Excel */}
      <button className="export-button" onClick={exportToExcel}>
        <FaPrint /> Imprimer
      </button>
    </AdminLayout>
  );
};

export default Admin;
