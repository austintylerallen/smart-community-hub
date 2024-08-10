const express = require('express');
const authRoutes = require('./auth');
const friendRoutes = require('./friend');
const newsfeedRoutes = require('./newsfeed');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/friends', friendRoutes);
router.use('/newsfeed', newsfeedRoutes);

module.exports = router;
