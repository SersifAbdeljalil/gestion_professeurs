import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { FaPrint, FaIdCard } from "react-icons/fa";
import AdminLayout from "../layouts/AdminLayout";

const Admin = () => {
  const [professeurs, setProfesseurs] = useState([]);
  const [downloading, setDownloading] = useState(false);

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

  // Fonction pour télécharger une carte professionnelle
  const downloadCard = async (profId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/cartes/${profId}/generate-pdf`,
        {
          method: "GET",
          headers: {
            Accept: "application/pdf",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors du téléchargement de la carte");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `carte_professionnelle_${profId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors du téléchargement de la carte");
    }
  };

// Fonction pour télécharger toutes les cartes
const downloadAllCards = async () => {
  try {
    const response = await fetch(
      "http://localhost:3001/api/cartes/generate-all-cards",
      {
        method: "GET",
        headers: {
          Accept: "application/pdf",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erreur lors du téléchargement des cartes");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "toutes_les_cartes.pdf";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Erreur:", error);
    alert("Erreur lors du téléchargement des cartes");
  }
};

  return (
    <AdminLayout>
      <div className="table-container">
        <h2 className="list-title">Liste des Professeurs</h2>
        <div className="button-group mb-4">
          <button 
            className="export-button mr-4" 
            onClick={exportToExcel}
          >
            <FaPrint /> Exporter la Liste
          </button>
          <button 
  className="export-button ml-4" 
  onClick={() => window.location.href = `/importer-prof`}>
  <FaPrint /> Importer Professeurs
</button>
<button 
  className="export-button ml-4" 
  onClick={downloadAllCards}
>
  <FaIdCard /> Télécharger Toutes les Cartes
</button>
        </div>
        <div className="table-wrapper">
          <table className="prof-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {professeurs.map((prof) => (
                <tr key={prof.id}>
                  <td>{prof.nom}</td>
                  <td>{prof.prenom}</td>
                  <td>{prof.email}</td>
                  <td>{prof.statut}</td>
                  <td>
                    <button
                      className="download-card-button"
                      onClick={() => downloadCard(prof.id)}
                    >
                      <FaIdCard /> Carte
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Admin;

