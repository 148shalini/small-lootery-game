import React from 'react';

const Grid = ({ grid, user, handleChange, gameStarted, drawnNumbers }) => {
  return (
    <div>
      <h2>User {user}</h2>
      <table>
        <tbody>
          {grid.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>
                  <input
                    type="number"
                    min="1"
                    max="9"
                    value={cell || ''}
                    onChange={(e) => handleChange(user, i, j, e.target.value)}
                    disabled={gameStarted}
                    style={{
                      width: '40px',
                      height: '40px',
                      textAlign: 'center',
                      backgroundColor: drawnNumbers.includes(cell) ? 'lightgray' : 'white',
                      opacity: drawnNumbers.includes(cell) ? 0.5 : 1,
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Grid;