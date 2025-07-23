// routes/maintenance.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roles');
const Maintenance = require('../models/maintainance');
const User = require('../models/User');

// ✅ Tenant raises request (already done)
router.post('/request', auth, checkRole(['Tenant']), async (req, res) => {
  const { description, property, unit } = req.body;

  const request = new Maintenance({
    tenant: req.user.id,
    description,
    property,
    unit
  });

  await request.save();
  res.json({ msg: 'Request submitted', request });
});

// ✅ Admin assigns to service provider
router.put('/assign/:id', auth, checkRole(['Admin', 'Landlord']), async (req, res) => {
  const { assignedTo } = req.body;

  const user = await User.findById(assignedTo);
  if (!user) return res.status(404).json({ msg: 'Service provider not found' });

  const request = await Maintenance.findByIdAndUpdate(
    req.params.id,
    { assignedTo, status: 'In Progress' },
    { new: true }
  );

  res.json({ msg: 'Assigned to service provider', request });
});

// ✅ Mark complete + log cost
router.put('/complete/:id', auth, checkRole(['Admin', 'Landlord', 'Caretaker']), async (req, res) => {
  const { cost } = req.body;

  const request = await Maintenance.findByIdAndUpdate(
    req.params.id,
    { status: 'Completed', cost },
    { new: true }
  );

  res.json({ msg: 'Task marked complete', request });
});

module.exports = router;
