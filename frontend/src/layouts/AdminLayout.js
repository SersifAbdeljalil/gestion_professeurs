import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaPlus, FaFileImport, FaSignOutAlt } from "react-icons/fa";
import "../styles/Admin.css"; 

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("profId");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* Barre latérale fixe */}
      <aside className="sidebar">
        <h2>Menu Administrateur</h2>
        <nav className="sidebar-menu">
          <Link to="/admin" className="nav-item">
            <FaHome /> Accueil
          </Link>
          <Link to="/ajouter-professeur" className="nav-item">
            <FaPlus /> Ajouter Professeur
          </Link>
          <Link to="/importer-prof" className="nav-item">
            <FaFileImport /> Importer Fichier
          </Link>
        </nav>
        {/* Bouton Déconnexion en bas */}
        <div className="logout-container">
          <button onClick={handleLogout} className="nav-item logout-button">
            <FaSignOutAlt /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Contenu dynamique */}
      <main className="main-content">{children}</main>
    </div>
  );
};

export default AdminLayout;
