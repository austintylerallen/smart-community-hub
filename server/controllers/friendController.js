const User = require('../models/User');

// Send a friend request
exports.sendFriendRequest = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(req.userId);
    const friend = await User.findById(userId);

    if (!friend) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.friendRequests.includes(userId) || user.friends.includes(userId)) {
      return res.status(400).json({ message: 'Friend request already sent or user is already a friend' });
    }

    friend.friendRequests.push(user._id);
    await friend.save();

    res.status(200).json({ message: 'Friend request sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Accept a friend request
exports.acceptFriendRequest = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(req.userId);
    const friend = await User.findById(userId);

    if (!friend) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.friends.push(userId);
    user.friendRequests = user.friendRequests.filter(id => id.toString() !== userId);
    await user.save();

    friend.friends.push(user._id);
    await friend.save();

    res.status(200).json({ message: 'Friend request accepted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
