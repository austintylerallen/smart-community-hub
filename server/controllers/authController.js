const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

exports.uploadProfilePicture = upload.single('profilePicture');

// Register a new user
exports.registerUser = async (req, res) => {
  const { email, password, name, location, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ email, password, name, location, role });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Log in an existing user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordCorrect = await existingUser.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const accessToken = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    existingUser.refreshToken = refreshToken;
    await existingUser.save();

    res.status(200).json({ result: existingUser, accessToken, refreshToken });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.refreshToken = async (req, res) => {
    const { token } = req.body;
  
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'Authentication failed: No token provided' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      console.log('Decoded refresh token:', decoded);
  
      const user = await User.findById(decoded.id);
      if (!user || user.refreshToken !== token) {
        console.log('Invalid token or user not found');
        return res.status(403).json({ message: 'Authentication failed: Invalid token' });
      }
  
      const newAccessToken = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

// Get the currently logged-in user's data
exports.getUser = async (req, res) => {
  try {
    console.log('Fetching user data for ID:', req.userId);  // Add this line
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update the currently logged-in user's data
exports.updateUser = async (req, res) => {
  const { email, name, location } = req.body;
  console.log('Update request:', { email, name, location });

  try {
    console.log('Updating user with ID:', req.userId);  // Add this line
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { email, name, location },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      console.error('User not found during update');
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.updateUser = async (req, res) => {
    const { email, name, location } = req.body;
    console.log('Update request received:', { email, name, location });
    console.log('User ID from token:', req.userId);
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.userId,
        { email, name, location },
        { new: true, runValidators: true }
      ).select('-password');
  
      if (!updatedUser) {
        console.error('User not found during update');
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };