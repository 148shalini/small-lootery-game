const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

router.post('/start-game', async (req, res) => {
  const { user1Grid, user2Grid } = req.body;
  try {
    const game = new Game({
      user1Grid,
      user2Grid,
      drawnNumbers: [],
      winner: null,
    });
    await game.save();
    res.status(200).json({ gameId: game._id });
  } catch (error) {
    res.status(500).json({ message: 'Error starting game', error });
  }
});

router.get('/game-state/:gameId', async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId);
    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching game state', error });
  }
});

module.exports = router;