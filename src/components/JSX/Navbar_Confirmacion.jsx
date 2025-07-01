import React from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Navbar_Confirmacion.css';
import logo from '../../Imagenes/Logo.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Logo del restaurante" className="logo-img" />
        </Link>
      </div>
      <div className="titulo-navbar">
        <h1>Confirmación</h1>
      </div>
    </nav>
  );
};

export default Navbar;
