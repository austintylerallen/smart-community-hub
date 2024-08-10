const Post = require('../models/Post');

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createPost = async (req, res) => {
  const { content } = req.body;

  try {
    const newPost = new Post({ content, creator: req.userId });
    await newPost.save();

    // Emit new post to all connected clients
    req.io.emit('newPost', newPost);

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
