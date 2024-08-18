import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Grid from './Grid';
import WinnerModal from './WinnerModal';

const socket = io('http://localhost:5000');

const Game = () => {
  const [user1Grid, setUser1Grid] = useState(Array(3).fill().map(() => Array(3).fill('')));
  const [user2Grid, setUser2Grid] = useState(Array(3).fill().map(() => Array(3).fill('')));
  const [gameStarted, setGameStarted] = useState(false);
  const [gameId, setGameId] = useState(null);
  const [drawnNumbers, setDrawnNumbers] = useState([]);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    socket.on('numberDrawn', ({ gameId: receivedGameId, number }) => {
      if (receivedGameId === gameId) {
        setDrawnNumbers(prev => [...prev, number]);
      }
    });

    socket.on('gameOver', ({ gameId: receivedGameId, winner }) => {
      if (receivedGameId === gameId) {
        setWinner(winner);
      }
    });

    return () => {
      socket.off('numberDrawn');
      socket.off('gameOver');
    };
  }, [gameId]);

  const handleChange = (user, row, col, value) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 1 || numValue > 9) return;

    const setGrid = user === 1 ? setUser1Grid : setUser2Grid;
    const currentGrid = user === 1 ? user1Grid : user2Grid;

    // Check if the number is already used in the grid
    if (currentGrid.flat().includes(numValue)) return;

    setGrid(prev => {
      const newGrid = [...prev];
      newGrid[row][col] = numValue;
      return newGrid;
    });
  };

  const startGame = async () => {
    if (!isGridValid(user1Grid) || !isGridValid(user2Grid)) {
      alert('Both grids must be completely filled with unique numbers 1-9');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/start-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user1Grid, user2Grid }),
      });
      const data = await response.json();
      setGameId(data.gameId);
      setGameStarted(true);
      socket.emit('startGame', data.gameId);
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  const isGridValid = (grid) => {
    const flatGrid = grid.flat();
    const uniqueNumbers = new Set(flatGrid);
    return flatGrid.length === 9 && uniqueNumbers.size === 9 && flatGrid.every(num => num >= 1 && num <= 9);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1> Lottery Game</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Grid grid={user1Grid} user={1} handleChange={handleChange} gameStarted={gameStarted} drawnNumbers={drawnNumbers} />
        <Grid grid={user2Grid} user={2} handleChange={handleChange} gameStarted={gameStarted} drawnNumbers={drawnNumbers} />
      </div>
      {!gameStarted && <button onClick={startGame}>Start Game</button>}
      {gameStarted && <h2>Last Drawn Number: {drawnNumbers[drawnNumbers.length - 1] || 'None'}</h2>}
      <WinnerModal winner={winner} onClose={() => setWinner(null)} />
    </div>
  );
};

export default Game;