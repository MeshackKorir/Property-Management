const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  unit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit',
    required: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  rentAmount: {
    type: Number,
    required: true
  },
  utilities: [
    {
      meter: { type: mongoose.Schema.Types.ObjectId, ref: 'Meter' },
      usage: Number,
      cost: Number
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
