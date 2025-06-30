import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar_Confirmacion from '../../components/JSX/Navbar_Confirmacion';
import '../CSS/Confirmacion.css';

const Confirmacion = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [reserva, setReserva] = useState({
    fecha: '',
    hora: '',
    mesa: '',
    personas: '',
  });

  const [formulario, setFormulario] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    notas: '',
  });

  const [error, setError] = useState('');

  // Cargar datos de la reserva al montar el componente
  useEffect(() => {
    if (location.state) {
      setReserva(location.state);
    } else {
      // Si no hay datos de reserva, redirigir a la página de reserva
      navigate('/reservas');
    }
  }, [location.state, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const validarTelefono = (telefono) => {
    // Expresión regular para validar teléfono (10 dígitos)
    const regex = /^[0-9]{10}$/;
    return regex.test(telefono);
  };

  const validarEmail = (email) => {
    // Expresión regular básica para validar email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleConfirmar = () => {
    const { nombre, apellido, telefono, correo } = formulario;

    // Validaciones
    if (!nombre.trim()) {
      setError('Por favor, ingresa tu nombre');
      return;
    }

    if (!apellido.trim()) {
      setError('Por favor, ingresa tu apellido');
      return;
    }

    if (!telefono.trim()) {
      setError('Por favor, ingresa tu teléfono');
      return;
    }

    if (!validarTelefono(telefono)) {
      setError('El teléfono debe tener 10 dígitos');
      return;
    }

    if (!correo.trim()) {
      setError('Por favor, ingresa tu correo electrónico');
      return;
    }

    if (!validarEmail(correo)) {
      setError('Por favor, ingresa un correo electrónico válido');
      return;
    }

    setError('');

    // Crear objeto con datos completos
    const confirmacionData = {
      ...reserva,
      ...formulario,
      fecha: new Date(reserva.fecha).toLocaleDateString(), // Formatear fecha
    };

    // Guardar en localStorage
    const confirmacionesGuardadas = JSON.parse(localStorage.getItem('confirmaciones')) || [];
    localStorage.setItem(
      'confirmaciones', 
      JSON.stringify([...confirmacionesGuardadas, confirmacionData])
    );

    // Navegar a página de agradecimiento
    navigate('/gracias', { state: confirmacionData });
  };

  return (
    <div className="confirmacion-page">
      <Navbar_Confirmacion/>

      <div className="restaurant-info">
        <h2>Confirmación de Reserva</h2>
        <p>
          Por favor, completa tus datos para confirmar tu reserva. Enviaremos la confirmación a tu correo electrónico.
        </p>
      </div>

      <div className="confirmacion-form">
        <div className="form-group resumen">
          <h3>Resumen de la Reserva</h3>
          <p><strong>Fecha:</strong> {new Date(reserva.fecha).toLocaleDateString()}</p>
          <p><strong>Hora:</strong> {reserva.hora}</p>
          <p><strong>Personas:</strong> {reserva.personas}</p>
          <p><strong>Mesa:</strong> {reserva.mesa}</p>
        </div>

        <div className="form-group">
          <h2>Datos del Cliente</h2>
          
          {error && <div className="error-message">{error}</div>}

          <div className="input-group">
            <h3>Nombre:</h3>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre*"
              value={formulario.nombre}
              onChange={handleInputChange}
              className={error.includes('nombre') ? 'input-error' : ''}
            />
          </div>

          <div className="input-group">
            <h3>Apellido:</h3>
            <input
              type="text"
              name="apellido"
              placeholder="Apellido*"
              value={formulario.apellido}
              onChange={handleInputChange}
              className={error.includes('apellido') ? 'input-error' : ''}
            />
          </div>

          <div className="input-group">
            <h3>Teléfono:</h3>
            <input
              type="tel"
              name="telefono"
              placeholder="Teléfono* (10 dígitos)"
              value={formulario.telefono}
              onChange={handleInputChange}
              maxLength="10"
              className={error.includes('teléfono') || error.includes('dígitos') ? 'input-error' : ''}
            />
          </div>

          <div className="input-group">
            <h3>Correo Electrónico:</h3>
            <input
              type="email"
              name="correo"
              placeholder="Correo Electrónico*"
              value={formulario.correo}
              onChange={handleInputChange}
              className={error.includes('correo') ? 'input-error' : ''}
            />
          </div>

          <div className="input-group">
            <h3>Notas Adicionales:</h3>
            <textarea
              name="notas"
              placeholder="Notas adicionales (opcional)"
              rows="3"
              value={formulario.notas}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button 
          className="back-button" 
          onClick={() => navigate('/reservas')}
        >
          Volver
        </button>
        <button 
          className="continue-button" 
          onClick={handleConfirmar}
        >
          Confirmar Reserva
        </button>
      </div>
    </div>
  );
};

export default Confirmacion;