const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  deposit: { type: Number, default: 0 },
  role: { type: String, enum: ['seller', 'buyer'], required: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;