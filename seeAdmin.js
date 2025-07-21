const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    let admin = await User.findOne({ email: 'meshackkorir200@gmail.com' });
    if (admin) {
      console.log('⚠️ Admin already exists!');
      process.exit(0);
    }

    // Create admin
    const hashedPassword = await bcrypt.hash('admin3614', 10);

    const newAdmin = new User({
      name: 'Meshack',
      email: 'meshackkorir200@gmail.com',
      password: hashedPassword,
      role: 'Admin'
    });

    await newAdmin.save();
    console.log('✅ Admin created: Meshack');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
