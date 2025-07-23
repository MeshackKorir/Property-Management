const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roles');
const { sendEmail, sendSMS } = require('../utils/notify');

// POST /api/notifications/send
router.post('/send', auth, checkRole(['Admin', 'Landlord']), async (req, res) => {
  const { type, to, subject, message } = req.body;

  try {
    if (type === 'email') {
      await sendEmail(to, subject, message);
      res.json({ msg: 'Email sent!' });
    } else if (type === 'sms') {
      sendSMS(to, message);
      res.json({ msg: 'SMS sent!' });
    } else {
      res.status(400).json({ msg: 'Invalid type' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;