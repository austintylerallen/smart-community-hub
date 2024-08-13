// controllers/userController.js
const User = require('../models/User');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('name email profilePicture');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUser = async (req, res) => {
    try {
      console.log('Fetching user data for ID:', req.userId);
      const user = await User.findById(req.userId)
        .select('-password')
        .populate('friendRequests.requester', 'name profilePicture');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

exports.updateUser = async (req, res) => {
  const { name, location, bio } = req.body;

  let profilePictureUrl;
  if (req.file) {
    profilePictureUrl = req.file.path; // Cloudinary automatically adds the path attribute to the file object
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { name, location, bio, profilePicture: profilePictureUrl },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
