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
    notas: '',
  });
  const [error, setError] = useState('');

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

  const formatearFecha = (fecha) => {
    try {
      return new Date(fecha).toLocaleDateString();
    } catch {
      return fecha;
    }
  };

  const handleConfirmar = () => {
    const { nombre, apellido, telefono, correo } = formulario;
    if (!nombre || !apellido || !telefono || !correo) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }
    if (!validarTelefono(telefono)) {
      alert('El teléfono debe tener exactamente 9 dígitos.');
      return;
    }
    if (!validarEmail(correo)) {
      alert('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    const confirmacionData = {
      ...reserva,
      ...formulario,
      fecha: formatearFecha(reserva.fecha),
    };

    const confirmacionesGuardadas = JSON.parse(localStorage.getItem('confirmaciones')) || [];
    localStorage.setItem('confirmaciones', JSON.stringify([...confirmacionesGuardadas, confirmacionData]));
    navigate('/gracias', { state: confirmacionData });
  };

  return (
    <div className="confirmacion-page">
      <Navbar_Confirmacion/>
      <div className="restaurant-info">
        <h2>Confirmación de Reserva</h2>
        <p>Por favor, completa tus datos para confirmar tu reserva.</p>
      </div>

      <div className="confirmacion-form">
        <div className="form-group resumen">
          <h3>Resumen de la Reserva</h3>
          <p><strong>Fecha:</strong> {formatearFecha(reserva.fecha)}</p>
          <p><strong>Hora:</strong> {reserva.hora}</p>
          <p><strong>Personas:</strong> {reserva.personas}</p>
          <p><strong>Mesa:</strong> {reserva.mesa}</p>
        </div>

        <div className="form-group">
          <h2>Datos del Cliente</h2>
          <div className="input-group"><h3>Nombre:</h3>
            <input type="text" name="nombre" placeholder="Nombre*" value={formulario.nombre} onChange={handleInputChange} />
          </div>
          <div className="input-group"><h3>Apellido:</h3>
            <input type="text" name="apellido" placeholder="Apellido*" value={formulario.apellido} onChange={handleInputChange} />
          </div>
          <div className="input-group"><h3>Teléfono:</h3>
            <input type="tel" name="telefono" placeholder="Teléfono* (9 dígitos)" maxLength="9" value={formulario.telefono} onChange={handleInputChange} />
          </div>
          <div className="input-group"><h3>Correo Electrónico:</h3>
            <input type="email" name="correo" placeholder="Correo Electrónico*" value={formulario.correo} onChange={handleInputChange} />
          </div>
          <div className="input-group"><h3>Notas Adicionales:</h3>
            <textarea name="notas" placeholder="Notas adicionales (opcional)" rows="3" value={formulario.notas} onChange={handleInputChange} />
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
