const express = require('express');
const { registerUser, loginUser, getUser, updateUser, refreshToken, uploadProfilePicture } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', auth, getUser);
router.put('/me', auth, uploadProfilePicture, updateUser);
router.post('/refresh-token', refreshToken);

module.exports = router;
