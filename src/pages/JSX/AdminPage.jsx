import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/AdminPage.css';
import Navbar from '../../components/JSX/Navbar';

const AdminPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [reservas, setReservas] = useState({});
  const [todasLasReservas, setTodasLasReservas] = useState([]);
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
  const [error, setError] = useState('');

  const tables = [
    { id: 1, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4" },
    { id: 2, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5" },
    { id: 3, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4" },
    { id: 4, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5" },
    { id: 5, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4" },
    { id: 6, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5" }
  ];

  const availableTimes = [];
  for (let hour = 12; hour <= 22; hour++) {
    availableTimes.push(`${hour}:00`);
    if (hour < 22) availableTimes.push(`${hour}:30`);
  }

  useEffect(() => {
    const reservasGuardadas = JSON.parse(localStorage.getItem('reservas')) || [];
    setTodasLasReservas(reservasGuardadas);

    const agrupadas = {};
    reservasGuardadas.forEach(reserva => {
      const fecha = reserva.fecha;
      if (!agrupadas[fecha]) agrupadas[fecha] = [];
      agrupadas[fecha].push(reserva);
    });
    setReservas(agrupadas);
  }, []);

  const changeMonth = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = (firstDayOfMonth + 6) % 7;

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

  const handleDateClick = (day) => {
    if (!day) return;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    setSelectedDate(formattedDate);
  };

  const openModal = (type, reserva = null) => {
    setModalType(type);
    setCurrentReserva(reserva);
    setError('');

    if (type === 'edit' && reserva) {
      setFormData({ ...reserva });
    } else {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { mesa, hora, fecha } = formData;

    const mesaYaReservada = todasLasReservas.some(r =>
      r.fecha === fecha &&
      r.hora === hora &&
      parseInt(r.mesa) === parseInt(mesa) &&
      (modalType !== 'edit' || r.id !== currentReserva?.id)
    );

    if (mesaYaReservada) {
      setError(`La mesa ${mesa} ya está reservada para las ${hora}.`);
      return;
    }

    let nuevasReservas = [...todasLasReservas];
    const nuevaData = {
      ...formData,
      mesa: Number(mesa),
      id: modalType === 'create' ? Date.now() : currentReserva.id
    };

    if (modalType === 'create') {
      nuevasReservas.push(nuevaData);
    } else {
      nuevasReservas = nuevasReservas.map(r =>
        r.id === currentReserva.id ? nuevaData : r
      );
    }

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
              const dateStr = day ? `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}` : '';
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
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
              <select name="mesa" value={formData.mesa} onChange={handleInputChange} required>
                <option value="">Mesa</option>
                {tables.map(t => (
                  <option key={t.id} value={t.id}>Mesa {t.id}</option>
                ))}
              </select>
              <input name="comensales" type="number" placeholder="Comensales" value={formData.comensales} onChange={handleInputChange} required />
              <input name="fecha" type="date" value={formData.fecha} onChange={handleInputChange} required />
              <select name="hora" value={formData.hora} onChange={handleInputChange} required>
                <option value="">Hora</option>
                {availableTimes.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
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
