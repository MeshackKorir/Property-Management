const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roles');

const router = express.Router();

// ==============================
// Tenant Registration (Self-signup)
// ==============================
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // Force role to Tenant
    user = new User({ name, email, password, role: 'Tenant' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// ==============================
// Login (All users)
// ==============================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// ==============================
// Create User (Admin + Landlord only)
// ==============================
router.post('/create-user', auth, checkRole(['Admin', 'Landlord']), async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let allowedRoles = ['Admin', 'Landlord', 'Caretaker', 'ServiceProvider'];

    if (req.user.role === 'Landlord') {
      // Landlords can ONLY create Caretaker or ServiceProvider
      allowedRoles = ['Caretaker', 'ServiceProvider', 'Tenant'];
    }

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ msg: 'Invalid role for your permission level' });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const newUser = new User({ name, email, password, role });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();

    res.json({ msg: `${role} user created successfully` });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/users', auth, checkRole(['Admin', 'Landlord']), async (req, res) => {
  const users = await User.find();
  res.json(users);
});

module.exports = router;
