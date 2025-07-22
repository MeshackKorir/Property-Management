 const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roles');

const Meter = require('../models/meter');
const Property = require('../models/Property');
const Unit = require('../models/Unit');

// ✅ Add a new Meter
router.post('/add-meter', auth, checkRole(['Admin', 'Landlord']), async (req, res) => {
  const { type, propertyId, unitId, unitPrice, billingType } = req.body;

  try {
    // Validate property exists
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ msg: 'Property not found' });

    // If unitId is provided, validate unit belongs to the property
    if (unitId) {
      const unit = await Unit.findById(unitId);
      if (!unit || unit.property.toString() !== propertyId) {
        return res.status(400).json({ msg: 'Invalid unit for this property' });
      }
    }

    const meter = new Meter({
      type,
      property: propertyId,
      unit: unitId || null,
      unitPrice,
      billingType
    });

    await meter.save();

    res.json({ msg: 'Meter added', meter });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
