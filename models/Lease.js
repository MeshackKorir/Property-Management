// models/Lease.js

const mongoose = require('mongoose');

const leaseSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', required: true },
  rentAmount: { type: Number, required: true },
  deposit: { type: Number },
  startDate: { type: Date },
  endDate: { type: Date },
  documents: [String] // Array of file paths
});

module.exports = mongoose.model('Lease', leaseSchema);
