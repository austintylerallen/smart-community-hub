const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authentication failed: No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Bearer token
    if (!token) {
      return res.status(401).json({ message: 'Authentication failed: No token provided' });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedData.id || decodedData._id; // Ensure this line is correct and consistent with your JWT payload

    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed: Invalid token' });
  }
};

module.exports = auth;
