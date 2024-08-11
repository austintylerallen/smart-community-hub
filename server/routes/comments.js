const express = require('express');
const { createComment, getComments, updateComment, deleteComment } = require('../controllers/commentController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createComment);
router.get('/:postId', auth, getComments);
router.put('/:commentId', auth, updateComment);
router.delete('/:commentId', auth, deleteComment);

module.exports = router;
