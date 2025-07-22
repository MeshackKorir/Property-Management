const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roles');
const Property = require('../models/Property');
const Unit = require('../models/Unit');

// Register a Property
router.post('/register-property', auth, checkRole(['Admin', 'Landlord']), async (req, res) => {
  const { name, location, ownerId, caretakerId } = req.body;

  try {
    const property = new Property({
      name,
      location,
      owner: ownerId,
      caretaker: caretakerId || null
    });

    await property.save();
    res.json({ msg: 'Property registered', property });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Add Unit to a Property
router.post('/add-unit', auth, checkRole(['Admin', 'Landlord']), async (req, res) => {
  const { propertyId, name, type } = req.body;

  try {
    const unit = new Unit({
      property: propertyId,
      name,
      type
    });

    await unit.save();
    res.json({ msg: 'Unit added', unit });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// OPTIONAL: Get all properties for an owner
router.get('/my-properties', auth, checkRole(['Landlord']), async (req, res) => {
  const properties = await Property.find({ owner: req.user.id }).populate('caretaker');
  res.json(properties);
});

// Add Unit to a Property
router.post('/add-unit', auth, checkRole(['Admin', 'Landlord']), async (req, res) => {
  const { propertyId, name, type } = req.body;

  try {
    const unit = new Unit({
      property: propertyId,
      name,
      type
    });

    await unit.save();
    res.json({ msg: 'Unit added', unit });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


// Assign a Caretaker to a Property
router.put('/assign-caretaker', auth, checkRole(['Admin', 'Landlord']), async (req, res) => {
  const { propertyId, caretakerId } = req.body;

  try {
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ msg: 'Property not found' });

    // Optional: Check caretaker really exists & has correct role
    const caretaker = await User.findById(caretakerId);
    if (!caretaker || caretaker.role !== 'Caretaker') {
      return res.status(400).json({ msg: 'Invalid caretaker ID' });
    }

    property.caretaker = caretakerId;
    await property.save();

    res.json({ msg: 'Caretaker assigned', property });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


module.exports = router;
