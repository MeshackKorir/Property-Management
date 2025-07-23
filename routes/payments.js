const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roles');

const Payment = require('../models/Payments');
const Invoice = require('../models/Invoice');

// POST Payment
router.post('/pay', auth, async (req, res) => {
  const { invoiceId, amount } = req.body;

  try {
    const payment = new Payment({
      tenant: req.user.id,
      invoice: invoiceId,
      amount
    });

    await payment.save();

    res.json({ msg: 'Payment recorded', payment });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET Payment History
router.get('/history', auth, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'Tenant') {
      filter = { tenant: req.user.id };
    }

    const payments = await Payment.find(filter).populate('invoice');

    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
