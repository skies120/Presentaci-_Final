import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/AdminPage.css';
import Navbar from '../../components/JSX/Navbar';

// Componente principal
const AdminPage = () => {
  const navigate = useNavigate();  // Hook para redirecciones

  // Estado para el mes actual mostrado en el calendario
  const [currentDate, setCurrentDate] = useState(new Date());
  // Estado para la fecha seleccionada (default: hoy)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Estados para reservas
  const [reservas, setReservas] = useState({}); // agrupadas por fecha
  const [todasLasReservas, setTodasLasReservas] = useState([]); // lista total

  // Estados para modal (crear/editar reserva)
  const [showModal, setShowModal] = useState(false); // abrir/cerrar modal
  const [modalType, setModalType] = useState(''); // 'create' o 'edit'
  const [currentReserva, setCurrentReserva] = useState(null); // reserva actual para editar
  const [formData, setFormData] = useState({ // datos del formulario
    mesa: '',
    comensales: '',
    fecha: selectedDate,
    hora: '',
    cliente: '',
    telefono: '',
    gmail: '',
    notas: ''
  });

  // useEffect para cargar reservas desde localStorage al montar el componente
  useEffect(() => {
    const reservasGuardadas = JSON.parse(localStorage.getItem('reservas')) || [];
    setTodasLasReservas(reservasGuardadas);

    // Agrupar por fecha
    const agrupadas = {};
    reservasGuardadas.forEach(reserva => {
      const fecha = reserva.fecha;
      if (!agrupadas[fecha]) agrupadas[fecha] = [];
      agrupadas[fecha].push(reserva);
    });
    setReservas(agrupadas);
  }, []);

  // Cambiar mes en el calendario
  const changeMonth = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  // Generar estructura de calendario para el mes actual
  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // día de la semana
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // días en mes

    const startDay = (firstDayOfMonth + 6) % 7; // ajustar para que lunes=0
    const calendar = [];
    let dayCounter = 1 - startDay; // iniciar con offset negativo para primeras celdas vacías

    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (dayCounter < 1 || dayCounter > daysInMonth) {
          week.push(null); // días fuera del mes
        } else {
          week.push(dayCounter);
        }
        dayCounter++;
      }
      calendar.push(week);
    }

    return calendar;
  };

  // Al hacer click en un día, setea la fecha seleccionada
  const handleDateClick = (day) => {
    if (!day) return;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    setSelectedDate(formattedDate);
  };

  // Abrir modal para crear o editar reserva
  const openModal = (type, reserva = null) => {
    setModalType(type);
    setCurrentReserva(reserva);
    if (type === 'edit' && reserva) {
      setFormData({ ...reserva }); // carga datos para editar
    } else if (type === 'create') {
      setFormData({ // limpia formulario
        mesa: '',
        comensales: '',
        fecha: selectedDate,
        hora: '',
        cliente: '',
        telefono: '',
        gmail: '',
        notas: ''
      });
    }
    setShowModal(true); // mostrar modal
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Guardar reserva (crear o editar)
  const handleSubmit = (e) => {
    e.preventDefault();
    let nuevasReservas = [...todasLasReservas];
    const nuevaData = {
      ...formData,
      mesa: Number(formData.mesa), // asegurarse de que sea número
      id: modalType === 'create' ? Date.now() : currentReserva.id
    };

    if (modalType === 'create') {
      nuevasReservas.push(nuevaData);
    } else if (modalType === 'edit') {
      nuevasReservas = nuevasReservas.map(r =>
        r.id === currentReserva.id ? nuevaData : r
      );
    }

    // guardar en localStorage y actualizar estado
    localStorage.setItem('reservas', JSON.stringify(nuevasReservas));
    setTodasLasReservas(nuevasReservas);

    // volver a agrupar por fecha
    const agrupadas = {};
    nuevasReservas.forEach(r => {
      if (!agrupadas[r.fecha]) agrupadas[r.fecha] = [];
      agrupadas[r.fecha].push(r);
    });
    setReservas(agrupadas);

    setShowModal(false); // cerrar modal
  };

  // Eliminar reserva
  const handleDelete = () => {
    const nuevasReservas = todasLasReservas.filter(r => r.id !== currentReserva.id);
    localStorage.setItem('reservas', JSON.stringify(nuevasReservas));
    setTodasLasReservas(nuevasReservas);

    const agrupadas = {};
    nuevasReservas.forEach(r => {
      if (!agrupadas[r.fecha]) agrupadas[r.fecha] = [];
      agrupadas[r.fecha].push(r);
    });
    setReservas(agrupadas);

    setShowModal(false);
  };

  // Nombres de los meses para el encabezado
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const weeks = generateCalendar(); // generar semanas del calendario

  return (
    <div className="admin-container">
      <Navbar /> {/* navbar superior */}

      <div className="top-panel">
        <h2>Panel de Administración</h2>
        <button className="logout-btn" onClick={() => navigate('/')}>Cerrar Sesión</button>
      </div>

      <div className="calendar-container">
        <div className="calendar-nav">
          <button onClick={() => changeMonth(-1)}>&lt;</button>
          <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
          <button onClick={() => changeMonth(1)}>&gt;</button>
        </div>

        <div className="calendar-header">
          <div>Lun</div><div>Mar</div><div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div><div>Dom</div>
        </div>

        {weeks.map((week, i) => (
          <div key={i} className="calendar-week">
            {week.map((day, j) => {
              const dateStr = day ? `${currentDate.getFullYear()}-${(currentDate.getMonth()+1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}` : '';
              const hasReservations = day && reservas[dateStr]?.length > 0;
              return (
                <div
                  key={j}
                  className={`calendar-day ${hasReservations ? 'has-reservations' : ''}`}
                  onClick={() => handleDateClick(day)}
                >
                  {day}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="reservas-container">
        <div className="reservas-header">
          <h3>Reservas para {selectedDate}</h3>
          <button onClick={() => openModal('create')}>Nueva Reserva</button>
        </div>
        {reservas[selectedDate]?.length > 0 ? (
          reservas[selectedDate].map((r) => (
            <div key={r.id} className="reserva-item" onClick={() => openModal('edit', r)}>
              <p><strong>Mesa:</strong> {r.mesa}</p>
              <p><strong>Cliente:</strong> {r.cliente}</p>
              <p><strong>Comensales:</strong> {r.comensales}</p>
              <p><strong>Tel:</strong> {r.telefono}</p>
              <p><strong>Gmail:</strong> {r.gmail}</p>
              <p><strong>Hora:</strong> {r.hora}</p>
              <p><strong>Notas:</strong> {r.notas}</p>
            </div>
          ))
        ) : <p>No hay reservas.</p>}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{modalType === 'create' ? 'Nueva' : 'Editar'} Reserva</h3>
            <form onSubmit={handleSubmit}>
              <input name="mesa" type="number" placeholder="Mesa" value={formData.mesa} onChange={handleInputChange} required />
              <input name="comensales" type="number" placeholder="Comensales" value={formData.comensales} onChange={handleInputChange} required />
              <input name="fecha" type="date" value={formData.fecha} onChange={handleInputChange} required />
              <input name="hora" type="time" value={formData.hora} onChange={handleInputChange} required />
              <input name="cliente" type="text" placeholder="Cliente" value={formData.cliente} onChange={handleInputChange} required />
              <input name="telefono" type="text" placeholder="Teléfono" value={formData.telefono} onChange={handleInputChange} required />
              <input name="gmail" type="email" placeholder="Gmail" value={formData.gmail} onChange={handleInputChange} required />
              <textarea name="notas" placeholder="Notas" value={formData.notas} onChange={handleInputChange} />
              <div className="form-buttons">
                <button type="button" onClick={() => setShowModal(false)}>Cerrar</button>
                {modalType === 'edit' && <button type="button" onClick={handleDelete}>Eliminar</button>}
                <button type="submit">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
