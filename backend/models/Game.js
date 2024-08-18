const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  user1Grid: [[Number]],
  user2Grid: [[Number]],
  drawnNumbers: [Number],
  winner: String,
});

module.exports = mongoose.model('Game', gameSchema);