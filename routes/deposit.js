// routes/deposit.js
const express = require('express');
const authMiddleware = require('../middleware/auth'); // Assume you have an authentication middleware
const User = require('../model/user');

const depositRoutes = express.Router();

// Deposit coins (accessible only to buyers)
depositRoutes.post('/deposit', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'buyer') {
      return res.status(403).json({ message: 'Only buyers can deposit coins' });
    }

    const { coins } = req.body;

    if (!Array.isArray(coins)) {
      return res.status(400).json({ message: 'Coins should be an array' });
    }

    const validCoins = [5, 10, 20, 50, 100];
    const totalDeposited = coins.reduce((acc, coin) => (validCoins.includes(coin) ? acc + coin : acc), 0);

    const user = await User.findById(req.user._id);
    user.deposit += totalDeposited;
    await user.save();

    res.status(200).json({ message: 'Coins deposited successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = depositRoutes;
