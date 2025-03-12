const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Middleware function to check if the user is authenticated
const isAuthenticated = (req, res, next) => {

  // Get the token from the request headers (Bearer Token)
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];  // Extract the token part from 'Bearer <token>'

  // Check if the token is provided
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Attach the decoded user information to the request object
    req.user = decoded;

    // Move to the next middleware or route handler
    next();

  } catch (error) {
    // If token verification fails, return 401 Unauthorized
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = isAuthenticated;
