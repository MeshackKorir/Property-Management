// models/Property.js
const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Landlord
  caretaker: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // optional
});

module.exports = mongoose.model('Property', PropertySchema);
