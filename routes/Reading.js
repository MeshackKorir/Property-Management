const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roles');

const Meter = require('../models/meter');
const Reading = require('../models/Reading');

// ✅ Add a new Reading for a Meter
router.post('/add-reading', auth, checkRole(['Admin', 'Landlord', 'Caretaker']), async (req, res) => {
  const { meterId, reading } = req.body;

  try {
    const meter = await Meter.findById(meterId);
    if (!meter) return res.status(404).json({ msg: 'Meter not found' });

    const newReading = new Reading({
      meter: meterId,
      reading
    });

    await newReading.save();

    res.json({ msg: 'Reading added', reading: newReading });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ✅ Get all Readings for a Meter (optional)
router.get('/:meterId', auth, checkRole(['Admin', 'Landlord', 'Caretaker']), async (req, res) => {
  try {
    const readings = await Reading.find({ meter: req.params.meterId }).sort({ date: -1 });
    res.json(readings);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
