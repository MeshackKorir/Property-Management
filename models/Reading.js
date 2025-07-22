const mongoose = require('mongoose');

const ReadingSchema = new mongoose.Schema({
  meter: { type: mongoose.Schema.Types.ObjectId, ref: 'Meter', required: true },
  reading: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reading', ReadingSchema);
