import React from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Navbar.css';
import logo from '../../Imagenes/Logo.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="Logo del restaurante" className="logo-img" />
      </div>
      <div className="nav-links">
        <Link to="/menu" className="nav-link">Platos del Día</Link>
        <Link to="/reservas" className="nav-link">Reservas</Link>
        <Link to="/" className="nav-link">Salir</Link>
      </div>
    </nav>
  );
};

export default Navbar;