import React from 'react';
import '../CSS/TableCard.css';

const TableCard = ({ table, isSelected, isReserved, onSelect }) => {
  return (
    <div 
      className={`table-card ${isSelected ? 'selected' : ''} ${isReserved ? 'reserved' : ''}`}
      onClick={!isReserved ? onSelect : undefined}
    >
      <img src={table.image} alt={`Mesa ${table.id}`} />

      {isReserved && (
        <>
          <div className="overlay"></div>
          <div className="tooltip">Mesa reservada</div>
        </>
      )}

      <div className="table-info">
        <h3>Mesa {table.id}</h3>
        <button 
          className={`reserve-btn ${isSelected ? 'selected' : ''} ${isReserved ? 'reserved' : ''}`}
          disabled={isReserved}
        >
          {isReserved ? 'Reservada' : isSelected ? 'Seleccionada' : 'Reservar'}
        </button>
      </div>
    </div>
  );
};

export default TableCard;
