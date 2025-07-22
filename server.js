const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/property', require('./routes/property'));
app.use('/api/landlord', require('./routes/landlord'));
app.use('/api/meter', require('./routes/meter'));
app.use('/api/reading', require('./routes/Reading'));
app.use('/api/invoice', require('./routes/invoice'));


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
