const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roles');

const Lease = require('../models/Lease');
const Unit = require('../models/Unit');
const Property = require('../models/Property');
const Meter = require('../models/meter');
const Reading = require('../models/Reading');
const Invoice = require('../models/Invoice');


// ✅ Generate Rent + Utility Invoice
router.post('/generate', auth, checkRole(['Admin', 'Landlord']), async (req, res) => {
  const { tenantId, unitId, propertyId } = req.body;

  try {
    // Get lease terms (example)
    const lease = await Lease.findOne({ tenant: tenantId, unit: unitId });
    if (!lease) return res.status(404).json({ msg: 'Lease not found' });

    // Get meters for the unit or property
    const meters = await Meter.find({ 
      $or: [
        { unit: unitId },
        { property: propertyId }
      ]
    });

    const utilities = [];

    for (const meter of meters) {
      const readings = await Reading.find({ meter: meter._id }).sort({ date: -1 }).limit(2);

      if (readings.length < 2) {
        console.log(`Not enough readings for meter ${meter._id}`);
        continue;
      }

      const currentReading = readings[0].reading;
      const previousReading = readings[1].reading;
      const usage = currentReading - previousReading;
      const cost = usage * meter.unitPrice;

      utilities.push({
        meter: meter._id,
        usage,
        cost
      });
    }

    // Sum utility cost
    const utilityTotal = utilities.reduce((acc, u) => acc + u.cost, 0);

    const totalAmount = lease.rentAmount + utilityTotal;

    const invoice = new Invoice({
      tenant: tenantId,
      unit: unitId,
      property: propertyId,
      rentAmount: lease.rentAmount,
      utilities,
      totalAmount,
      dueDate: lease.dueDate || new Date() // adjust for your logic
    });

    await invoice.save();

    res.json({ msg: 'Invoice generated', invoice });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
