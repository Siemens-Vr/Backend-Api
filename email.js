require('dotenv').config();



const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
const testEmail = async () => {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: 'chelddymusingila@gmail.com',
        subject: 'Test Email',
        text: 'This is a test email.',
      });
      console.log('Test email sent successfully.');
    } catch (error) {
      console.error('Error sending test email:', error);
    }
  };
  
  testEmail();
  