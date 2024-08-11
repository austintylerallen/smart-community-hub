const Post = require('../models/Post');

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate('creator', 'name');
    console.log('Fetched posts from database:', posts); // Log fetched posts from database
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error); // Log any error
    res.status(500).json({ message: 'Server error' });
  }
};


exports.createPost = async (req, res) => {
  const { content } = req.body;

  try {
    const newPost = new Post({
      content,
      creator: req.userId,
    });

    await newPost.save();

    // Emit new post to all connected clients
    req.io.emit('newPost', newPost);

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.creator.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await post.remove();
    res.status(200).json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
