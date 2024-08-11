const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.status(200).json(user);
  } catch (error) {
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
