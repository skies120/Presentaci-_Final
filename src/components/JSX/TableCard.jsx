import React from 'react';
import '../../pages/CSS/Reservation.css';

const TableCard = ({ table, isSelected, isReserved, onSelect }) => {
  return (
    <div className={`table-card ${isSelected ? 'selected' : ''} ${isReserved ? 'reserved' : ''}`}>
      <img 
        src={table.image} 
        alt={`Mesa ${table.id}`} 
        style={{ width: '100%', borderRadius: '8px' }} 
      />
      <div className="table-info" style={{ textAlign: 'center' }}>
        <p>Mesa {table.id}</p>
        {isReserved 
          ? <span 
              className="reserved-text"
              style={{
                display: 'inline-block',
                marginTop: '10px',
                padding: '8px 16px',
                borderRadius: '5px',
                backgroundColor: '#ccc',
                color: '#555',
                fontWeight: 'bold'
              }}
            >
              Reservada
            </span>
          : (
            <button 
              onClick={onSelect} 
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: '#27ae60',
                color: 'white',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
            >
              Seleccionar mesa
            </button>
          )
        }
      </div>
    </div>
  );
};

export default TableCard;
