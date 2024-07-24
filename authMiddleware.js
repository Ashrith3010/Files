const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from Bearer schema

  if (token == null) return res.sendStatus(401); // If no token, unauthorized

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // If token invalid, forbidden
    req.user = user; // Store user info in request
    next();
  });
};

module.exports = authenticateToken;
