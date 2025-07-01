import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale';
import Navbar from '../../components/JSX/Navbar';
import TableCard from '../../components/JSX/TableCard';
import '../CSS/Reservation.css';

// Componente principal de reservación
const Reservation = () => {
  const navigate = useNavigate(); // hook para navegación entre páginas

  // Estados principales
  const [guests, setGuests] = useState(2); // número de comensales
  const [selectedDate, setSelectedDate] = useState(new Date()); // fecha seleccionada
  const [selectedTime, setSelectedTime] = useState('19:00'); // hora seleccionada
  const [selectedTable, setSelectedTable] = useState(null); // mesa seleccionada
  const [reservedTables, setReservedTables] = useState([]); // lista de todas las reservas
  const [currentMonth, setCurrentMonth] = useState(new Date()); // para controlar el calendario

  // Al montar el componente, carga reservas guardadas del localStorage
  useEffect(() => {
    const reservasGuardadas = JSON.parse(localStorage.getItem('reservas')) || [];
    setReservedTables(reservasGuardadas);
  }, []);

  // Formatea fecha a YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Selección de mesa
  const handleTableSelect = (tableId) => {
    // Revisa si ya está reservada esa mesa para la fecha y hora elegidas
    const yaReservada = reservedTables.some(r =>
      r.fecha === formatDate(selectedDate) &&
      r.hora === selectedTime &&
      parseInt(r.mesa) === tableId
    );
    if (yaReservada) return; // si está reservada, no hace nada
    setSelectedTable(tableId); // sino, selecciona la mesa
  };

  // Confirma la reserva y la guarda
  const handleReserve = () => {
    if (!selectedTable) return;

    const nuevaReserva = {
      fecha: formatDate(selectedDate),
      hora: selectedTime,
      mesa: selectedTable,
      personas: guests
    };

    const nuevasReservas = [...reservedTables, nuevaReserva];
    localStorage.setItem('reservas', JSON.stringify(nuevasReservas));
    setReservedTables(nuevasReservas);

    navigate('/confirmacion', { state: nuevaReserva }); // navega a página de confirmación
  };

  // Al cambiar mes en el calendario
  const handleMonthChange = (date) => {
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  // Filtra para no permitir fines de semana
  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  // Define las mesas disponibles con imágenes
  const tables = [
    { id: 1, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4" },
    { id: 2, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5" },
    { id: 3, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4" },
    { id: 4, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5" },
    { id: 5, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4" },
    { id: 6, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5" }
  ];

  // Genera horas disponibles cada 30 minutos entre 12:00 y 22:30
  const availableTimes = [];
  for (let hour = 12; hour <= 22; hour++) {
    availableTimes.push(`${hour}:00`);
    if (hour < 22) availableTimes.push(`${hour}:30`);
  }

  return (
    <div className="reservation-page">
      <Navbar /> {/* navbar superior */}

      <div className="restaurant-info">
        <h2>Reserva tu experiencia culinaria</h2>
        <p>
          En nuestro restaurante, cada plato es una celebración de sabor.
          Disfruta de una cocina exquisita en un ambiente acogedor.
        </p>
      </div>

      <div className="reservation-form">
        {/* Seleccionar número de comensales */}
        <div className="form-group">
          <label>Elige la cantidad de clientes</label>
          <select value={guests} onChange={(e) => setGuests(parseInt(e.target.value))}>
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        {/* Seleccionar fecha con react-datepicker */}
        <div className="form-group">
          <label>Selecciona una fecha</label>
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <p>Fecha seleccionada: {selectedDate?.toLocaleDateString()}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              inline
              locale={es} // español
              minDate={new Date()}
              maxDate={new Date(new Date().setMonth(new Date().getMonth() + 3))}
              filterDate={isWeekday}
              onMonthChange={handleMonthChange}
              dateFormat="yyyy-MM-dd"
            />
          </div>
        </div>

        {/* Seleccionar hora */}
        <div className="form-group">
          <label>Selecciona una hora</label>
          <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
            {availableTimes.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Renderiza las mesas */}
      <h3>Selecciona una mesa</h3>
      <div className="tables-grid">
        {tables.map(table => {
          const isReserved = reservedTables.some(r =>
            r.fecha === formatDate(selectedDate) &&
            r.hora === selectedTime &&
            parseInt(r.mesa) === table.id
          );

          return (
            <TableCard 
              key={table.id}
              table={table}
              isSelected={selectedTable === table.id}
              isReserved={isReserved}
              onSelect={() => handleTableSelect(table.id)}
            />
          );
        })}
      </div>

      {/* Botones de acción */}
      <div className="action-buttons">
        <button className="back-button" onClick={() => navigate('/menu')}>Regresar</button>
        <button 
          className="continue-button"
          onClick={handleReserve}
          disabled={!selectedTable} // deshabilitado hasta que elija mesa
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default Reservation;
