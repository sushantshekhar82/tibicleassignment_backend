// routes/reset.js
const express = require('express');
const authMiddleware = require('../middleware/auth'); // Assume you have an authentication middleware
const User = require('../model/user');

const resetRoutes = express.Router();

// Reset deposit (accessible only to buyers)
resetRoutes.post('/reset', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'buyer') {
      return res.status(403).json({ message: 'Only buyers can reset their deposit' });
    }

    // Reset the user's deposit to zero
    req.user.deposit = 0;
    await req.user.save();

    res.status(200).json({ message: 'Deposit reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = resetRoutes;
