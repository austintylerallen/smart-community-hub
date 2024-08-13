const User = require('../models/User');
const Notification = require('../models/Notification');

exports.sendFriendRequest = async (req, res) => {
  const { recipientId } = req.body;
  const requesterId = req.userId;

  try {
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'User not found' });
    }

    recipient.friendRequests.push(requesterId);
    await recipient.save();

    req.io.to(recipientId).emit('friendRequestReceived', { requesterId });

    res.status(200).json({ message: 'Friend request sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.acceptFriendRequest = async (req, res) => {
  const { requesterId } = req.body;
  const recipientId = req.userId;

  try {
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'User not found' });
    }

    recipient.friends.push(requesterId);
    recipient.friendRequests = recipient.friendRequests.filter(req => req.toString() !== requesterId);
    await recipient.save();

    const requester = await User.findById(requesterId);
    requester.friends.push(recipientId);
    await requester.save();

    res.status(200).json({ message: 'Friend request accepted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.declineFriendRequest = async (req, res) => {
  const { requesterId } = req.body;
  const recipientId = req.userId;

  try {
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'User not found' });
    }

    recipient.friendRequests = recipient.friendRequests.filter(req => req.toString() !== requesterId);
    await recipient.save();

    res.status(200).json({ message: 'Friend request declined' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('name email profilePicture');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
