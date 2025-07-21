// models/Unit.js
const mongoose = require('mongoose');

const UnitSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['1BR', '2BR', 'Shop', 'Office'], required: true },
});

module.exports = mongoose.model('Unit', UnitSchema);
