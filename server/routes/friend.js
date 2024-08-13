const express = require('express');
const { sendFriendRequest, acceptFriendRequest, declineFriendRequest, getUsers } = require('../controllers/friendController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/send', auth, sendFriendRequest);
router.post('/accept', auth, acceptFriendRequest);
router.post('/decline', auth, declineFriendRequest);
router.get('/', auth, getUsers);

module.exports = router;
