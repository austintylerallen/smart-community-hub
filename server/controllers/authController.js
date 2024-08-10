const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateAccessToken = (user) => {
  return jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ email: user.email, id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// Register a new user
const registerUser = async (req, res) => {
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
const loginUser = async (req, res) => {
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

    const accessToken = generateAccessToken(existingUser);
    const refreshToken = generateRefreshToken(existingUser);

    existingUser.refreshToken = refreshToken;
    await existingUser.save();

    res.status(200).json({ result: existingUser, accessToken, refreshToken });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Refresh Access Token
const refreshToken = async (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(401).json({ message: 'Authentication failed: No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: 'Authentication failed: Invalid token' });
    }

    const newAccessToken = generateAccessToken(user);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get the currently logged-in user's data
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.status(200).json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update the currently logged-in user's data
const updateUser = async (req, res) => {
  const { email, name, location } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { email, name, location },
      { new: true, runValidators: true }
    ).select('-password');
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  getUser,
  updateUser,
};
