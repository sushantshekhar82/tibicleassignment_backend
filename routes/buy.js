// routes/buy.js
const express = require('express');
const authMiddleware = require('../middleware/auth'); // Assume you have an authentication middleware
const User = require('../model/user');
const Product = require('../model/products');
const PurchaseHistory = require('../model/purchasehistory');

const buyRoutes = express.Router();

// Buy products (accessible only to buyers)
buyRoutes.post('/buy/:productId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'buyer') {
      return res.status(403).json({ message: 'Only buyers can buy products' });
    }

    const { productId } = req.params;
    const { amount } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const totalCost = product.cost * amount;

    if (req.user.deposit < totalCost) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Deduct the cost from the user's deposit
    req.user.deposit -= totalCost;
    await req.user.save();

    // Update the product's available amount
    product.amountAvailable -= amount;
    await product.save();
// Record the purchase in the purchase history
const purchase = new PurchaseHistory({
    userId: req.user._id,
    productId,
    quantity: amount
  });
  await purchase.save();

    res.status(200).json({
      message: 'Purchase successful',
      totalSpent: totalCost,
      productsPurchased: { productId: product._id, amount },
      change: req.user.deposit
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = buyRoutes;
