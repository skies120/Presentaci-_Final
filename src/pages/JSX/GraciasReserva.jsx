import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../CSS/GraciasReserva.css';

// ---------------------------------------------
// Componente GraciasReserva
// Página que muestra un mensaje de agradecimiento
// y los detalles de la reserva confirmada.
// ---------------------------------------------
const GraciasReserva = () => {
  const navigate = useNavigate();

  // Obtener los datos enviados desde la página anterior
  // mediante useLocation().state
  const { state } = useLocation();
  const reserva = state || {};  // Fallback vacío si no hay state

  return (
    <div className="gracias-container">
      <div className="gracias-box">
        {/* Mensaje principal con nombre del cliente */}
        <h1>¡Gracias por tu reserva, {reserva.nombre}!</h1>
        <p>Tu reserva ha sido confirmada correctamente.</p>
        
        {/* Mostrar los detalles de la reserva */}
        <div className="reserva-details">
          <h2>Detalles de tu reserva:</h2>
          <p><strong>Fecha:</strong> {reserva.fecha}</p>
          <p><strong>Hora:</strong> {reserva.hora}</p>
          <p><strong>Mesa:</strong> {reserva.mesa}</p>
          <p><strong>Personas:</strong> {reserva.personas}</p>
        </div>

        {/* Aviso de confirmación al correo */}
        <p>Hemos enviado un correo de confirmación a {reserva.correo}</p>
        
        {/* Botón para volver a la página principal */}
        <button className="salir-btn" onClick={() => navigate('/')}>
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default GraciasReserva;
