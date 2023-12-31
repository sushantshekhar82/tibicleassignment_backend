// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../model/user');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
require('dotenv').config()
// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(201).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
      role
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
        //login
router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
    
      // Find the user by username
      const user = await User.findOne({ username });
      
      if (!user) {
        return res.status(201).json({ message: 'Invalid username or password,Please Register first' });
      }
      const userid=user._id
      const uniqueuser=user.username;
      const role=user.role;
      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(201).json({ message: 'Invalid username or password' });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.secret_key);
  
      res.status(200).json({userid,uniqueuser,role,token} );
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  router.get('/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(201).json({ message: 'User not found' });
      }
  
      res.status(200).json(user);
    }
      catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    })
module.exports = router;
