const jwt = require('jsonwebtoken');
require('dotenv').config()

exports.verifyToken = (req, res, next) => {

  const token = req.headers.authorization?.split(' ')[1];
  console.log(token)
  if (!token) {
    req.userId = null; // Allow execution to continue
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = decoded.userId;
  } catch (error) {
    console.error("Error in verifyToken:", error);
    req.userId = null; 
  }

  next();
};
