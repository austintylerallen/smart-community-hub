// routes/friend.js
const express = require('express');
const router = express.Router();
const { sendFriendRequest, acceptFriendRequest, declineFriendRequest, getFriendRequests } = require('../controllers/friendController');
const auth = require('../middleware/auth');

router.post('/send', auth, sendFriendRequest);
router.post('/accept', auth, acceptFriendRequest);
router.post('/decline', auth, declineFriendRequest);
router.get('/requests', auth, getFriendRequests);

module.exports = router;
