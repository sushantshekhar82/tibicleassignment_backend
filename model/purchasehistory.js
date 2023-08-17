// models/PurchaseHistory.js
const mongoose = require('mongoose');

const purchaseHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName:{type:String,required:true},
  quantity: { type: Number, required: true },
  purchaseDate: { type: Date, default: Date.now() },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const PurchaseHistory = mongoose.model('PurchaseHistory', purchaseHistorySchema);

module.exports = PurchaseHistory;
