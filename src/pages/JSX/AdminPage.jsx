import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/AdminPage.css';
import Navbar from '../../components/JSX/Navbar';

const AdminPage = () => {
  const navigate = useNavigate();

  // Estados del calendario
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Estados para gestionar reservas y confirmaciones
  const [reservas, setReservas] = useState({});
  const [todasLasReservas, setTodasLasReservas] = useState([]);
  const [confirmaciones, setConfirmaciones] = useState([]);

  // Estados del modal
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentReserva, setCurrentReserva] = useState(null);
  const [formData, setFormData] = useState({
    mesa: '',
    comensales: '',
    fecha: selectedDate,
    hora: '',
    cliente: '',
    telefono: '',
    gmail: '',
    notas: ''
  });

  // Cargar reservas y confirmaciones del localStorage
  useEffect(() => {
    const reservasGuardadas = JSON.parse(localStorage.getItem('reservas')) || [];
    setTodasLasReservas(reservasGuardadas);

    const reservasPorFecha = {};
    reservasGuardadas.forEach(reserva => {
      const fecha = reserva.fecha;
      if (!reservasPorFecha[fecha]) reservasPorFecha[fecha] = [];
      reservasPorFecha[fecha].push(reserva);
    });
    setReservas(reservasPorFecha);

    const confirmacionesGuardadas = JSON.parse(localStorage.getItem('confirmaciones')) || [];
    setConfirmaciones(confirmacionesGuardadas);
  }, []);

  // Cambiar mes en el calendario
  const changeMonth = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  // Generar el calendario del mes actual
  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const startDay = (firstDayOfMonth + 6) % 7; // Ajustar para que lunes sea 0
    const calendar = [];
    let dayCounter = 1 - startDay;

    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (dayCounter < 1 || dayCounter > daysInMonth) {
          week.push(null);
        } else {
          week.push(dayCounter);
        }
        dayCounter++;
      }
      calendar.push(week);
    }

    return calendar;
  };

  // Manejar click en un día
// Manejar click en un día sin cambiar de mes
const handleDateClick = (day) => {
  if (!day) return;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  setSelectedDate(formattedDate);
}

  // Abrir modal
  const openModal = (type, reserva = null) => {
    setModalType(type);
    setCurrentReserva(reserva);
    if (type === 'edit' && reserva) {
      setFormData({ ...reserva });
    } else if (type === 'create') {
      setFormData({
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
    setShowModal(true);
  };

  // Cambiar campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  //  Guardar (crear o editar) reserva
  const handleSubmit = (e) => {
    e.preventDefault();

    let nuevasReservas = [...todasLasReservas];
    if (modalType === 'create') {
      const newReserva = { ...formData, id: Date.now() };
      nuevasReservas.push(newReserva);
    } else if (modalType === 'edit') {
      nuevasReservas = nuevasReservas.map(r => r.id === currentReserva.id ? { ...formData, id: r.id } : r);
    }

    localStorage.setItem('reservas', JSON.stringify(nuevasReservas));
    setTodasLasReservas(nuevasReservas);

    // Recalcular agrupadas por fecha
    const agrupadas = {};
    nuevasReservas.forEach(r => {
      if (!agrupadas[r.fecha]) agrupadas[r.fecha] = [];
      agrupadas[r.fecha].push(r);
    });
    setReservas(agrupadas);

    setShowModal(false);
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

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const weeks = generateCalendar();

  return (
    <div className="admin-container">
      <Navbar />

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
