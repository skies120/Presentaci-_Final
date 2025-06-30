import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../CSS/GraciasReserva.css';

const GraciasReserva = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const reserva = state || {};

  return (
    <div className="gracias-container">
      <div className="gracias-box">
        <h1>¡Gracias por tu reserva, {reserva.nombre}!</h1>
        <p>Tu reserva ha sido confirmada correctamente.</p>
        
        <div className="reserva-details">
          <h2>Detalles de tu reserva:</h2>
          <p><strong>Fecha:</strong> {reserva.fecha}</p>
          <p><strong>Hora:</strong> {reserva.hora}</p>
          <p><strong>Mesa:</strong> {reserva.mesa}</p>
          <p><strong>Personas:</strong> {reserva.personas}</p>
        </div>

        <p>Hemos enviado un correo de confirmación a {reserva.correo}</p>
        
        <button className="salir-btn" onClick={() => navigate('/')}>
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default GraciasReserva;