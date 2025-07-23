const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roles');

const Lease = require('../models/Lease');

router.post('/create', auth, checkRole(['Admin', 'Landlord']), async (req, res) => {
  const { tenantId, unitId, rentAmount, deposit, startDate, endDate, dueDate } = req.body;

  try {
    const lease = new Lease({
      tenant: tenantId,
      unit: unitId,
      rentAmount,
      deposit,
      startDate,
      endDate,
      dueDate
    });

    await lease.save();

    res.json({ msg: 'Lease created', lease });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
