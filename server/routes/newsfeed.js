const express = require('express');
const { getPosts, createPost } = require('../controllers/postController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getPosts);
router.post('/', auth, createPost);

module.exports = router;
