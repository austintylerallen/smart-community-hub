const express = require('express');
const { getPosts, createPost, deletePost } = require('../controllers/postController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getPosts);
router.post('/', auth, createPost);
router.delete('/:id', auth, deletePost); // Add this line

module.exports = router;
