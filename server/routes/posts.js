const express = require('express');
const { getPosts, createPost, deletePost, likePost, unlikePost } = require('../controllers/postController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getPosts);
router.post('/', auth, createPost);
router.delete('/:id', auth, deletePost);
router.put('/:id/like', auth, likePost); // Add this line
router.put('/:id/unlike', auth, unlikePost); // Add this line

module.exports = router;
