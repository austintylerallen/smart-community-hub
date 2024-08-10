const express = require('express');
const { sendFriendRequest, acceptFriendRequest } = require('../controllers/friendController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/send', auth, sendFriendRequest);
router.post('/accept', auth, acceptFriendRequest);

module.exports = router;
