// routes/tenant.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roles');

const Lease = require('../models/Lease');
const Invoice = require('../models/Invoice');
const Reading = require('../models/Reading');
const Maintenance = require('../models/maintainance');

router.get('/lease', auth, checkRole(['Tenant']), async (req, res) => {
  const lease = await Lease.findOne({ tenant: req.user.id }).populate('unit property');
  if (!lease) return res.status(404).json({ msg: 'No lease found' });
  res.json(lease);
});

router.get('/invoices', auth, checkRole(['Tenant']), async (req, res) => {
  const invoices = await Invoice.find({ tenant: req.user.id });
  res.json(invoices);
});

router.get('/usage', auth, checkRole(['Tenant']), async (req, res) => {
  const readings = await Reading.find({ tenant: req.user.id }).populate('meter');
  res.json(readings);
});

router.get('/maintenance', auth, checkRole(['Tenant']), async (req, res) => {
  const requests = await Maintenance.find({ tenant: req.user.id });
  res.json(requests);
});

module.exports = router;
