// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../model/user');
require('dotenv').config()
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
console.log(token)
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decodedToken = jwt.verify(token, process.env.secret_key);
console.log(decodedToken)
    const user = await User.findOne({ _id: decodedToken.userId });
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    req.user = user;

    if (req.user.role !== 'seller' && req.user.role !== 'buyer') {
      return res.status(403).json({ message: 'Invalid user role' });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = authMiddleware;
