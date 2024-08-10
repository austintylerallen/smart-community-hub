const Event = require('../models/Event');
const Post = require('../models/Post');
const User = require('../models/User');

exports.getNewsfeed = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('friends');
    const friendIds = user.friends.map(friend => friend._id);

    const posts = await Post.find({
      creator: { $in: friendIds }
    }).sort({ createdAt: -1 });

    const events = await Event.find({
      location: user.location
    }).sort({ date: -1 });

    res.status(200).json({ posts, events });
  } catch (error) {
    console.error('Error fetching newsfeed:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
