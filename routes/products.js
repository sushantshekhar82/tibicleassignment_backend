const express = require('express');
const authMiddleware = require('../middleware/auth'); 
const Product = require('../model/products');

const prodrouter = express.Router();

// Get all products (accessible to anyone)
prodrouter.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch products for a specific seller
prodrouter.get('/products/seller/:sellerId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'seller') {
      return res.status(403).json({ message: 'Only sellers can view their products' });
    }

    const sellerId = req.params.sellerId;

    // Check if the logged-in seller is requesting their own products
    if (req.user._id.toString() !== sellerId) {
      return res.status(403).json({ message: 'Unauthorized access to seller products' });
    }

    const products = await Product.find({ sellerId });

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new product (accessible only to sellers)
prodrouter.post('/products', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'seller') {
      return res.status(403).json({ message: 'Only sellers can create products' });
    }

    const { productName, cost, amountAvailable } = req.body;
    const sellerId = req.user._id;

    const newProduct = new Product({ productName, cost, amountAvailable ,sellerId });
    await newProduct.save();

    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a product by ID (accessible to anyone)
prodrouter.get('/products/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a product by ID (accessible only to sellers)
prodrouter.put('/products/:productId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'seller') {
      return res.status(403).json({ message: 'Only sellers can update products' });
    }

    const { productName, cost,amountAvailable } = req.body;
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.productName = productName;
    product.cost = cost;
    product.amountAvailable=amountAvailable
    await product.save();

    res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a product by ID (accessible only to sellers)
prodrouter.delete('/products/:productId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'seller') {
      return res.status(403).json({ message: 'Only sellers can delete products' });
    }

    const product = await Product.findByIdAndDelete(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = prodrouter;
