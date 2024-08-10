const express = require('express');
const { getNewsfeed } = require('../controllers/newsfeedController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getNewsfeed);

module.exports = router;
