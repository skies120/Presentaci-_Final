import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar_Confirmacion from '../../components/JSX/Navbar_Confirmacion';
import '../CSS/Confirmacion.css';

const Confirmacion = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [reserva, setReserva] = useState({});
  const [formulario, setFormulario] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    notas: ''
  });

  useEffect(() => {
    if (location.state) {
      setReserva(location.state);
      localStorage.setItem('ultimaReserva', JSON.stringify(location.state));
    } else {
      const ultimaReserva = JSON.parse(localStorage.getItem('ultimaReserva'));
      if (ultimaReserva) {
        setReserva(ultimaReserva);
      } else {
        navigate('/reservas');
      }
    }
  }, [location.state, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const validarTelefono = (telefono) => /^[0-9]{9}$/.test(telefono);
  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleConfirmar = () => {
    if (!formulario.nombre || !formulario.apellido || !formulario.telefono || !formulario.correo) {
      alert('Completa todos los campos obligatorios.');
      return;
    }
    if (!validarTelefono(formulario.telefono)) {
      alert('El teléfono debe tener exactamente 9 dígitos.');
      return;
    }
    if (!validarEmail(formulario.correo)) {
      alert('Ingresa un correo electrónico válido.');
      return;
    }

    // Combina datos
    const nuevaReservaConfirmada = {
      ...reserva,
      cliente: `${formulario.nombre} ${formulario.apellido}`,
      telefono: formulario.telefono,
      gmail: formulario.correo,
      notas: formulario.notas
    };

    // Guarda en el mismo arreglo, ACTUALIZANDO por ID
    const reservasGuardadas = JSON.parse(localStorage.getItem('reservas')) || [];
    const reservasActualizadas = reservasGuardadas.map(r =>
      r.id === reserva.id ? nuevaReservaConfirmada : r
    );

    localStorage.setItem('reservas', JSON.stringify(reservasActualizadas));

    navigate('/gracias', { state: nuevaReservaConfirmada });
  };

  return (
    <div className="confirmacion-page">
      <Navbar_Confirmacion />

      <div className="restaurant-info">
        <h2>Confirmación de Reserva</h2>
        <p>Por favor, completa tus datos para confirmar tu reserva.</p>
      </div>

      <div className="confirmacion-form">
        <div className="form-group resumen">
          <h3>Resumen de la Reserva</h3>
          <p><strong>Fecha:</strong> {reserva.fecha}</p>
          <p><strong>Hora:</strong> {reserva.hora}</p>
          <p><strong>Personas:</strong> {reserva.comensales}</p>
          <p><strong>Mesa:</strong> {reserva.mesa}</p>
        </div>

        <div className="form-group">
          <h2>Datos del Cliente</h2>
          <div className="input-group">
            <h3>Nombre:</h3>
            <input name="nombre" value={formulario.nombre} onChange={handleInputChange} placeholder="Nombre*" />
          </div>
          <div className="input-group">
            <h3>Apellido:</h3>
            <input name="apellido" value={formulario.apellido} onChange={handleInputChange} placeholder="Apellido*" />
          </div>
          <div className="input-group">
            <h3>Teléfono:</h3>
            <input name="telefono" value={formulario.telefono} onChange={handleInputChange} placeholder="Teléfono*" maxLength="9" />
          </div>
          <div className="input-group">
            <h3>Correo Electrónico:</h3>
            <input name="correo" value={formulario.correo} onChange={handleInputChange} placeholder="Correo Electrónico*" />
          </div>
          <div className="input-group">
            <h3>Notas:</h3>
            <textarea name="notas" value={formulario.notas} onChange={handleInputChange} rows="3" placeholder="Notas adicionales" />
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button className="back-button" onClick={() => navigate('/reservas')}>Volver</button>
        <button className="continue-button" onClick={handleConfirmar}>Confirmar Reserva</button>
      </div>
    </div>
  );
};

export default Confirmacion;
