const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Or your SMTP provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  };

  await transporter.sendMail(mailOptions);
};

const sendSMS = (phoneNumber, message) => {
  // For now just log it — later plug Twilio, Africa's Talking, etc.
  console.log(`Sending SMS to ${phoneNumber}: ${message}`);
};

module.exports = {
  sendEmail,
  sendSMS
};