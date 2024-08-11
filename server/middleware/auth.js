const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('No authorization header');
      return res.status(401).json({ message: 'Authentication failed: No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Bearer token
    if (!token) {
      console.log('No token found');
      return res.status(401).json({ message: 'Authentication failed: No token provided' });
    }

    console.log('Token:', token);

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedData.id;
    console.log('Decoded user ID:', decodedData.id);

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Authentication failed: Invalid token' });
  }
};

module.exports = auth;
