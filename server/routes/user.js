// routes/user.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const { getUsers, getUser, updateUser } = require('../controllers/userController');
const auth = require('../middleware/auth');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_pictures',
    format: async (req, file) => 'jpg',
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

const parser = multer({ storage: storage });

router.get('/', auth, getUsers); // Route to fetch all users
router.get('/me', auth, getUser);
router.put('/me', auth, parser.single('profilePicture'), updateUser); // Adding parser for profile picture upload

module.exports = router;
