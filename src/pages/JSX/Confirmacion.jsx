import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar_Confirmacion from '../../components/JSX/Navbar_Confirmacion';
import '../CSS/Confirmacion.css';

const Confirmacion = () => {
  // Hook de react-router-dom para obtener el objeto location (pasar datos entre páginas)
  const location = useLocation();
  // Hook para navegar programáticamente
  const navigate = useNavigate();

  // Estado para guardar la reserva que viene desde /reservas o localStorage
  const [reserva, setReserva] = useState({});

  // Estado para el formulario del cliente
  const [formulario, setFormulario] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    notas: '',
  });

  // Estado para un posible mensaje de error (no se usa actualmente para renderizado)
  const [error, setError] = useState('');

  // --------------------------
  // Cargar la reserva:
  // Si viene del location.state (es decir, fue enviada desde la página de reservas)
  // se guarda en el estado y también en localStorage como últimaReserva
  // Si no, intenta recuperarla del localStorage
  // Si no hay, redirige al usuario a la página de reservas
  // --------------------------
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

  // --------------------------
  // Manejar cambios en el formulario de inputs
  // --------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  // Validación del teléfono (exactamente 9 dígitos)
  const validarTelefono = (telefono) => /^[0-9]{9}$/.test(telefono);

  // Validación básica del email
  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Formatear la fecha a formato local legible
  const formatearFecha = (fecha) => {
    try {
      return new Date(fecha).toLocaleDateString();
    } catch {
      return fecha;
    }
  };

  // --------------------------
  // Confirmar reserva
  // Hace:
  // - validación básica
  // - guarda en localStorage un array de confirmaciones
  // - navega a /gracias pasando la data confirmada
  // --------------------------
  const handleConfirmar = () => {
    const { nombre, apellido, telefono, correo } = formulario;

    // Validaciones
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

    // Preparar objeto de confirmación combinando reserva con datos del cliente
    const confirmacionData = {
      ...reserva,
      ...formulario,
      fecha: formatearFecha(reserva.fecha),
    };

    // Guardar en localStorage (con append a confirmaciones existentes)
    const confirmacionesGuardadas = JSON.parse(localStorage.getItem('confirmaciones')) || [];
    localStorage.setItem('confirmaciones', JSON.stringify([...confirmacionesGuardadas, confirmacionData]));

    // Navegar a página de agradecimiento
    navigate('/gracias', { state: confirmacionData });
  };

  return (
    <div className="confirmacion-page">
      {/* Navbar superior */}
      <Navbar_Confirmacion/>

      {/* Bloque con la información general */}
      <div className="restaurant-info">
        <h2>Confirmación de Reserva</h2>
        <p>Por favor, completa tus datos para confirmar tu reserva.</p>
      </div>

      {/* Formulario principal: dividido en resumen + inputs */}
      <div className="confirmacion-form">
        {/* Resumen de reserva */}
        <div className="form-group resumen">
          <h3>Resumen de la Reserva</h3>
          <p><strong>Fecha:</strong> {formatearFecha(reserva.fecha)}</p>
          <p><strong>Hora:</strong> {reserva.hora}</p>
          <p><strong>Personas:</strong> {reserva.personas}</p>
          <p><strong>Mesa:</strong> {reserva.mesa}</p>
        </div>

        {/* Datos del cliente */}
        <div className="form-group">
          <h2>Datos del Cliente</h2>
          <div className="input-group">
            <h3>Nombre:</h3>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre*"
              value={formulario.nombre}
              onChange={handleInputChange}
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
            />
          </div>
          <div className="input-group">
            <h3>Teléfono:</h3>
            <input
              type="tel"
              name="telefono"
              placeholder="Teléfono* (9 dígitos)"
              maxLength="9"
              value={formulario.telefono}
              onChange={handleInputChange}
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

      {/* Botones de acción */}
      <div className="action-buttons">
        <button className="back-button" onClick={() => navigate('/reservas')}>Volver</button>
        <button className="continue-button" onClick={handleConfirmar}>Confirmar Reserva</button>
      </div>
    </div>
  );
};

export default Confirmacion;
