import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale';
import Navbar from '../../components/JSX/Navbar';
import TableCard from '../../components/JSX/TableCard';
import '../CSS/Reservation.css';

const Reservation = () => {
  const navigate = useNavigate();
  const [guests, setGuests] = useState(2);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('19:00');
  const [selectedTable, setSelectedTable] = useState(null);
  const [reservedTables, setReservedTables] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Cargar reservas guardadas al entrar
  useEffect(() => {
    const reservasGuardadas = JSON.parse(localStorage.getItem('reservas')) || [];
    setReservedTables(reservasGuardadas);
  }, []);

  const handleTableSelect = (tableId) => {
    // Comprueba si está reservada en la fecha y hora seleccionadas
    const yaReservada = reservedTables.some(r =>
      new Date(r.fecha).toDateString() === selectedDate.toDateString() &&
      r.hora === selectedTime &&
      r.mesa === tableId
    );
    if (yaReservada) return;
    setSelectedTable(tableId);
  };

  const handleReserve = () => {
    if (!selectedTable) return;

    const nuevaReserva = {
      fecha: selectedDate.toISOString(),
      hora: selectedTime,
      mesa: selectedTable,
      personas: guests
    };

    const nuevasReservas = [...reservedTables, nuevaReserva];
    localStorage.setItem('reservas', JSON.stringify(nuevasReservas));
    setReservedTables(nuevasReservas);

    navigate('/confirmacion', { state: nuevaReserva });
  };

  const handleMonthChange = (date) => {
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

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

  return (
    <div className="reservation-page">
      <Navbar />
      <div className="restaurant-info">
        <h2>Reserva tu experiencia culinaria</h2>
        <p>
          En nuestro restaurante, cada plato es una celebración de sabor.
          Disfruta de una cocina exquisita en un ambiente acogedor.
        </p>
      </div>

      <div className="reservation-form">
        <div className="form-group">
          <label>Elige la cantidad de clientes</label>
          <select value={guests} onChange={(e) => setGuests(parseInt(e.target.value))}>
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

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
              locale={es}
              minDate={new Date()}
              maxDate={new Date(new Date().setMonth(new Date().getMonth() + 3))}
              filterDate={isWeekday}
              onMonthChange={handleMonthChange}
              dateFormat="yyyy-MM-dd"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Selecciona una hora</label>
          <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
            {availableTimes.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
      </div>

      <h3>Selecciona una mesa</h3>
      <div className="tables-grid">
        {tables.map(table => {
          const isReserved = reservedTables.some(r =>
            new Date(r.fecha).toDateString() === selectedDate.toDateString() &&
            r.hora === selectedTime &&
            r.mesa === table.id
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

      <div className="action-buttons">
        <button className="back-button" onClick={() => navigate('/menu')}>Regresar</button>
        <button 
          className="continue-button"
          onClick={handleReserve}
          disabled={!selectedTable}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default Reservation;