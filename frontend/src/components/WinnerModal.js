import React from 'react';

const WinnerModal = ({ winner, onClose }) => {
  if (!winner) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        textAlign: 'center',
      }}>
        <h2>{winner === 'Tie' ? "It's a Tie!" : `${winner} wins!`}</h2>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default WinnerModal;