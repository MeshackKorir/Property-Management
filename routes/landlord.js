const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roles');
const User = require('../models/User');

// ✅ Update Landlord Profile Info
router.put('/update-profile/:landlordId', auth, checkRole(['Admin', 'Landlord']), async (req, res) => {
  const { kraPin, phone, email } = req.body;

  try {
    const landlord = await User.findById(req.params.landlordId);
    if (!landlord || landlord.role !== 'Landlord') {
      return res.status(404).json({ msg: 'Landlord not found' });
    }

    // ✅ Update allowed fields only
    if (kraPin) landlord.kraPin = kraPin;
    if (phone) landlord.phone = phone;
    if (email) landlord.email = email;

    await landlord.save();
    res.json({ msg: 'Landlord profile updated', landlord });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
