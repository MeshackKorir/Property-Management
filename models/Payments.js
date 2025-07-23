const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
  amount: Number,
  method: String, // e.g., M-PESA
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', PaymentSchema);
