const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roles');
const Lease = require('../models/Lease');
const upload = require('../middleware/upload');

// POST /api/lease/create
router.post('/create', auth, checkRole(['Admin', 'Landlord']), upload.array('documents', 5), async (req, res) => {
  try {
    const { tenant, unit, rentAmount, deposit, startDate, endDate } = req.body;

    const filePaths = req.files.map(file => file.path);

    const lease = new Lease({
      tenant,
      unit,
      rentAmount,
      deposit,
      startDate,
      endDate,
      documents: filePaths
    });

    await lease.save();

    res.json({ msg: 'Lease created with documents', lease });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
