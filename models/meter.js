const mongoose = require('mongoose');

const MeterSchema = new mongoose.Schema({
  type: { type: String, enum: ['Water', 'Electricity'], required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: null }, // optional
  unitPrice: { type: Number, required: true },
  billingType: { type: String, enum: ['Shared', 'Individual'], required: true }
});

module.exports = mongoose.model('Meter', MeterSchema);
