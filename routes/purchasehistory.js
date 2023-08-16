// routes/purchase-history.js
const express = require('express');
const authMiddleware = require('../middleware/auth');
const PurchaseHistory = require('../model/purchasehistory');

const purchaserouter = express.Router();

// Fetch purchase history for the logged-in user
purchaserouter.get('/purchase-history', authMiddleware, async (req, res) => {
  try {
    const purchaseHistory = await PurchaseHistory.find({ userId: req.user._id })
      .populate('productId', 'productName cost') // Populate product details
      .sort({ purchaseDate: -1 }); // Sort by purchase date (most recent first)
      
    res.status(200).json(purchaseHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = purchaserouter;
