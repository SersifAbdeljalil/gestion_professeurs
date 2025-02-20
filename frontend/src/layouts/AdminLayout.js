import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaPlus, FaSignOutAlt } from "react-icons/fa";
import "../styles/Admin.css"; 
import FS from '../images/FS.png';

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
        <div className="logo-container">
          <img 
            src={FS} alt="Logo Admin"
            className="admin-logo"
          />
        </div>
        <nav className="sidebar-menu">
          <Link to="/admin" className="nav-item">
            <FaHome /> Accueil
          </Link>
          <Link to="/ajouter-professeur" className="nav-item">
            <FaPlus /> Ajouter Professeur
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