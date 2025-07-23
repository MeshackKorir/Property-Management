const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roles');

const Invoice = require('../models/Invoice');
const Lease = require('../models/Lease');
const Payment = require('../models/Payments');

router.get('/rent-collection', auth, checkRole(['Admin', 'Landlord']), async (req, res) => {
  const invoices = await Invoice.find();
  const totalRent = invoices.reduce((sum, inv) => sum + inv.rentAmount, 0);
  res.json({ totalRent });
});

router.get('/outstanding', auth, checkRole(['Admin', 'Landlord']), async (req, res) => {
  // For simplicity: sum invoices minus payments
  const invoices = await Invoice.find();
  const payments = await Payment.find();

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalPaid = payments.reduce((sum, pay) => sum + pay.amount, 0);

  const outstanding = totalInvoiced - totalPaid;

  res.json({ totalInvoiced, totalPaid, outstanding });
});

module.exports = router;
