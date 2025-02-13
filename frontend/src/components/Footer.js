import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Accueil.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="copyright">© 2025 Faculté des sciences. Tous droits réservés.</p>
        <p className="address">123 Avenue du Savoir, El Jadida</p>
        <div className="footer-links">
          <Link to="/contact" className="footer-link">Contact</Link>
          <Link to="/legal" className="footer-link">Mentions légales</Link>
          <Link to="/privacy" className="footer-link">Politique de confidentialité</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;