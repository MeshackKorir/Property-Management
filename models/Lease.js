const mongoose = require('mongoose');

const LeaseSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
  rentAmount: { type: Number, required: true },
  deposit: { type: Number, default: 0 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  dueDate: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Lease', LeaseSchema);