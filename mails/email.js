const { ACCOUNT_CREATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE } = require('./emailTemplates');
const {transporter} = require('./email.Config');
require('dotenv').config();

exports.sendAccountCreationEmail = async (email, password) => {
  try {
    const response = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email, 
      subject: 'Account Created by the Admin',
      html: ACCOUNT_CREATION_EMAIL_TEMPLATE
        .replace('{email}', email)
        .replace('{password}', password),
    });
    console.log('Email sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Error sending verification email: ${error.message}`);
  }
};

exports.sendPasswordResetEmail = async(email, resetURL)=>{
  try {
    const response = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email, 
      subject: 'Account Created by the Admin',
      html: PASSWORD_RESET_REQUEST_TEMPLATE
        .replace(/{resetURL}/g, resetURL)
       
    });
    console.log('Email sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Error sending verification email: ${error.message}`);
  }

}
