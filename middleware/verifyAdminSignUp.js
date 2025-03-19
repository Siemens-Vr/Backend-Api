import jwt from "jsonwebtoken";

 
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  if (!req.cookies || !req.cookies.token) {
    req.userId = null; // Allow request to proceed even if no token
    return next();
  }

  const token = req.cookies.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
  } catch (error) {
    console.error("Error verifying token:", error.message);
    req.userId = null; // Allow execution to continue without a valid token
  }

  next();
};

module.exports = { verifyToken }; //  Correct export for CommonJS

