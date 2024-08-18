const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const gameRoutes = require('./routes/gameRoutes');
const Game = require('./models/Game');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use('/api', gameRoutes);

mongoose.connect('mongodb://localhost:27017/lottery-game', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('startGame', async (gameId) => {
    const game = await Game.findById(gameId);
    if (!game) return;

    const drawNumber = () => {
      const availableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => !game.drawnNumbers.includes(n));
      if (availableNumbers.length === 0) {
        io.emit('gameOver', { gameId, winner: 'Tie' });
        return;
      }
      const drawnNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
      game.drawnNumbers.push(drawnNumber);
      io.emit('numberDrawn', { gameId, number: drawnNumber });

      const checkWinner = (grid) => {
        // Check rows
        for (let i = 0; i < 3; i++) {
          if (grid[i].every(num => game.drawnNumbers.includes(num))) return true;
        }
        // Check columns
        for (let i = 0; i < 3; i++) {
          if (grid.every(row => game.drawnNumbers.includes(row[i]))) return true;
        }
        return false;
      };

      if (checkWinner(game.user1Grid)) {
        game.winner = 'User 1';
        io.emit('gameOver', { gameId, winner: 'User 1' });
      } else if (checkWinner(game.user2Grid)) {
        game.winner = 'User 2';
        io.emit('gameOver', { gameId, winner: 'User 2' });
      } else {
        setTimeout(drawNumber, 3000); // Draw next number after 3 seconds
      }

      game.save();
    };

    drawNumber();
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));