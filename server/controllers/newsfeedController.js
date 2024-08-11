const Post = require('../models/Post');
const Event = require('../models/Event');
const User = require('../models/User');

exports.getNewsfeed = async (req, res) => {
  try {
    console.log('Fetching newsfeed for user ID:', req.userId);

    const user = await User.findById(req.userId).populate('friends');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const friendIds = user.friends.map(friend => friend._id);
    console.log('Friend IDs:', friendIds);

    const posts = await Post.find({
      creator: { $in: friendIds }
    }).populate('creator').sort({ createdAt: -1 });

    console.log('Posts:', posts);

    const events = await Event.find({
      location: user.location
    }).sort({ date: -1 });

    console.log('Events:', events);

    res.status(200).json({ posts, events });
  } catch (error) {
    console.error('Error fetching newsfeed:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
