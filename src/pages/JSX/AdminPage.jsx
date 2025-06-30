import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/AdminPage.css';
import Navbar from '../../components/JSX/Navbar';

const AdminPage = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [reservas, setReservas] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentReserva, setCurrentReserva] = useState(null);
  const [formData, setFormData] = useState({
    mesa: '',
    hora: '',
    cliente: '',
    comensales: ''
  });
  const [todasLasReservas, setTodasLasReservas] = useState([]);
  const [confirmaciones, setConfirmaciones] = useState([]);

  // Cargar datos de localStorage
  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = () => {
    // Cargar reservas de mesas
    const reservasGuardadas = JSON.parse(localStorage.getItem('reservas')) || [];
    setTodasLasReservas(reservasGuardadas);

    // Organizar reservas por fecha
    const reservasPorFecha = {};
    reservasGuardadas.forEach(reserva => {
      const fecha = new Date(reserva.fecha).toISOString().split('T')[0];
      if (!reservasPorFecha[fecha]) {
        reservasPorFecha[fecha] = [];
      }
      reservasPorFecha[fecha].push({
        id: `${reserva.mesa}-${reserva.hora}-${fecha}`,
        mesa: reserva.mesa,
        hora: reserva.hora,
        cliente: 'Cliente (ver detalles)',
        comensales: reserva.personas,
        fechaCompleta: reserva.fecha
      });
    });
    setReservas(reservasPorFecha);

    // Cargar datos de confirmación
    const confirmacionesGuardadas = JSON.parse(localStorage.getItem('confirmaciones')) || [];
    setConfirmaciones(confirmacionesGuardadas);
  };

  const changeMonth = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const daysInMonth = lastDay.getDate();
    
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    const weeks = [];
    let day = 1;
    let nextMonthDay = 1;
    
    for (let i = 0; i < 6; i++) {
      const days = [];
      
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < startDay) {
          days.push(prevMonthLastDay - (startDay - j - 1));
        } else if (day > daysInMonth) {
          days.push(nextMonthDay++);
        } else {
          days.push(day++);
        }
      }
      
      if (i > 0 && days[0] > daysInMonth) break;
      weeks.push(days);
    }
    
    return weeks;
  };

  const handleDateClick = (day) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    setSelectedDate(formattedDate);
  };

  const openModal = (type, reserva = null) => {
    setModalType(type);
    setCurrentReserva(reserva);
    
    if (type === 'edit' && reserva) {
      setFormData({
        mesa: reserva.mesa,
        hora: reserva.hora,
        cliente: reserva.cliente,
        comensales: reserva.comensales
      });
    } else if (type === 'create') {
      setFormData({
        mesa: '',
        hora: '',
        cliente: '',
        comensales: ''
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
    
    // Actualizar localStorage
    const reservasGuardadas = JSON.parse(localStorage.getItem('reservas')) || [];
    let nuevasReservas = [...reservasGuardadas];
    
    if (modalType === 'create') {
      const newReserva = {
        id: Date.now(),
        mesa: parseInt(formData.mesa),
        hora: formData.hora,
        cliente: formData.cliente,
        personas: parseInt(formData.comensales),
        fecha: new Date(selectedDate).toISOString()
      };
      
      // Actualizar estado
      setReservas(prev => {
        const newReservas = {
          ...prev,
          [selectedDate]: [...(prev[selectedDate] || []), {
            ...newReserva,
            comensales: newReserva.personas
          }]
        };
        return newReservas;
      });
      
      // Actualizar localStorage
      nuevasReservas.push(newReserva);
      localStorage.setItem('reservas', JSON.stringify(nuevasReservas));
      setTodasLasReservas(nuevasReservas);
      
    } else if (modalType === 'edit' && currentReserva) {
      // Actualizar estado
      setReservas(prev => {
        const updatedReservas = {
          ...prev,
          [selectedDate]: prev[selectedDate].map(r => 
            r.id === currentReserva.id ? { 
              ...r, 
              mesa: formData.mesa,
              hora: formData.hora,
              cliente: formData.cliente,
              comensales: formData.comensales
            } : r
          )
        };
        return updatedReservas;
      });
      
      // Actualizar localStorage
      nuevasReservas = nuevasReservas.map(r => {
        const fecha = new Date(r.fecha).toISOString().split('T')[0];
        if (fecha === selectedDate && r.mesa === currentReserva.mesa && r.hora === currentReserva.hora) {
          return {
            ...r,
            mesa: formData.mesa,
            hora: formData.hora,
            cliente: formData.cliente,
            personas: formData.comensales
          };
        }
        return r;
      });
      
      localStorage.setItem('reservas', JSON.stringify(nuevasReservas));
      setTodasLasReservas(nuevasReservas);
    }
    
    setShowModal(false);
  };

  const handleDelete = () => {
    if (currentReserva) {
      // Actualizar estado
      setReservas(prev => {
        const updatedReservas = {
          ...prev,
          [selectedDate]: prev[selectedDate].filter(r => r.id !== currentReserva.id)
        };
        return updatedReservas;
      });
      
      // Actualizar localStorage
      const reservasGuardadas = JSON.parse(localStorage.getItem('reservas')) || [];
      const nuevasReservas = reservasGuardadas.filter(r => {
        const fecha = new Date(r.fecha).toISOString().split('T')[0];
        return !(fecha === selectedDate && r.mesa === currentReserva.mesa && r.hora === currentReserva.hora);
      });
      
      localStorage.setItem('reservas', JSON.stringify(nuevasReservas));
      setTodasLasReservas(nuevasReservas);
      
      setShowModal(false);
    }
  };

  const weeks = generateCalendar();
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  return (
    <div className="admin-container">
      <div className="top-panel">
        <div className="top-panel-left">
          <h2>Panel de Administración</h2>
        </div>
        <div className="top-panel-right">
          <button className="logout-btn" onClick={() => navigate('/')}>Cerrar Sesión</button>
          <button className="refresh-btn" onClick={loadReservations}>Actualizar Datos</button>
        </div>
      </div>
      
      <div className="calendar-container">
        <div className="calendar-nav">
          <button 
            className="nav-button" 
            onClick={() => changeMonth(-1)}
            disabled={currentDate.getFullYear() <= new Date().getFullYear() && currentDate.getMonth() <= new Date().getMonth()}
          >
            &lt;
          </button>
          <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
          <button 
            className="nav-button" 
            onClick={() => changeMonth(1)}
            disabled={currentDate.getFullYear() >= 2099 && currentDate.getMonth() >= 11}
          >
            &gt;
          </button>
        </div>
        
        <div className="calendar-header">
          <div>LUN</div>
          <div>MAR</div>
          <div>MIÉ</div>
          <div>JUE</div>
          <div>VIE</div>
          <div>SÁB</div>
          <div>DOM</div>
        </div>
        
        {weeks.map((week, i) => (
          <div key={i} className="calendar-week">
            {week.map((day, j) => {
              const isCurrentMonth = !((i === 0 && day > 7) || (i >= 4 && day < 7));
              const dayClass = isCurrentMonth ? 'calendar-day' : 'calendar-day other-month';
              const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth()+1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
              const hasReservations = reservas[dateStr]?.length > 0;
              
              return (
                <div 
                  key={j} 
                  className={`${dayClass} ${hasReservations ? 'has-reservations' : ''}`}
                  onClick={() => isCurrentMonth && handleDateClick(day)}
                >
                  {day}
                  {hasReservations && <div className="reservation-dot"></div>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      <div className="reservas-container">
        <div className="reservas-header">
          <h2>Reservas para {selectedDate}</h2>
          <button 
            className="add-reserva-btn"
            onClick={() => openModal('create')}
          >
            Nueva Reserva
          </button>
        </div>
        {reservas[selectedDate]?.length > 0 ? (
          <div className="reservas-list">
            {reservas[selectedDate].map((reserva) => {
              const confirmacion = confirmaciones.find(c => 
                new Date(c.fecha).toISOString().split('T')[0] === selectedDate && 
                c.hora === reserva.hora && 
                c.mesa === reserva.mesa
              );
              
              return (
                <div key={reserva.id} className="reserva-item" onClick={() => openModal('edit', reserva)}>
                  <div className="reserva-info">
                    <span>Mesa {reserva.mesa} — {reserva.hora}</span>
                    <span>{reserva.comensales} personas</span>
                    {confirmacion && (
                      <div className="confirmacion-info">
                        <p><strong>Cliente:</strong> {confirmacion.nombre} {confirmacion.apellido}</p>
                        <p><strong>Contacto:</strong> {confirmacion.telefono} | {confirmacion.correo}</p>
                        {confirmacion.notas && <p><strong>Notas:</strong> {confirmacion.notas}</p>}
                      </div>
                    )}
                  </div>
                  <div className="reserva-actions">
                    <button 
                      className="edit-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal('edit', reserva);
                      }}
                    >
                      Editar
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal('delete', reserva);
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No hay reservas para esta fecha.</p>
        )}
      </div>
      
      <div className="all-reservations-container">
        <h2>Todas las Reservas Registradas</h2>
        {todasLasReservas.length > 0 ? (
          <div className="reservas-list">
            {todasLasReservas.map((reserva, index) => {
              const confirmacion = confirmaciones.find(c => 
                c.fecha === reserva.fecha && 
                c.hora === reserva.hora && 
                c.mesa === reserva.mesa
              );
              
              return (
                <div key={index} className="reserva-item">
                  <div className="reserva-info">
                    <p><strong>Fecha:</strong> {new Date(reserva.fecha).toLocaleDateString()}</p>
                    <p><strong>Hora:</strong> {reserva.hora}</p>
                    <p><strong>Mesa:</strong> {reserva.mesa}</p>
                    <p><strong>Personas:</strong> {reserva.personas}</p>
                    {confirmacion ? (
                      <>
                        <p><strong>Cliente:</strong> {confirmacion.nombre} {confirmacion.apellido}</p>
                        <p><strong>Teléfono:</strong> {confirmacion.telefono}</p>
                        <p><strong>Correo:</strong> {confirmacion.correo}</p>
                        {confirmacion.notas && <p><strong>Notas:</strong> {confirmacion.notas}</p>}
                      </>
                    ) : (
                      <p className="warning">Sin confirmar</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No hay reservas registradas aún.</p>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>
                {modalType === 'create' && 'Nueva Reserva'}
                {modalType === 'edit' && 'Editar Reserva'}
                {modalType === 'delete' && 'Confirmar Eliminación'}
              </h3>
              <button 
                className="close-modal"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              {modalType === 'delete' ? (
                <div>
                  <p>¿Estás seguro de eliminar esta reserva?</p>
                  <div className="modal-actions">
                    <button className="cancel-btn" onClick={() => setShowModal(false)}>
                      Cancelar
                    </button>
                    <button className="confirm-delete-btn" onClick={handleDelete}>
                      Eliminar
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Mesa:</label>
                    <input
                      type="number"
                      name="mesa"
                      value={formData.mesa}
                      onChange={handleInputChange}
                      required
                      min="1"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Hora:</label>
                    <input
                      type="time"
                      name="hora"
                      value={formData.hora}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Cliente:</label>
                    <input
                      type="text"
                      name="cliente"
                      value={formData.cliente}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Comensales:</label>
                    <input
                      type="number"
                      name="comensales"
                      value={formData.comensales}
                      onChange={handleInputChange}
                      required
                      min="1"
                    />
                  </div>
                  
                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => setShowModal(false)}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="confirm-btn">
                      {modalType === 'create' ? 'Crear' : 'Actualizar'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;