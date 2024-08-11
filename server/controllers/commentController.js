const Comment = require('../models/Comment');

exports.createComment = async (req, res) => {
  const { content, postId } = req.body;

  try {
    const newComment = new Comment({ content, creator: req.userId, postId });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).populate('creator').sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateComment = async (req, res) => {
  const { content } = req.body;

  try {
    const updatedComment = await Comment.findByIdAndUpdate(req.params.commentId, { content }, { new: true });
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
