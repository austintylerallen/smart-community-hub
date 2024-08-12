// controllers/friendController.js
const User = require('../models/User');
const FriendRequest = require('../models/FriendRequest');


exports.sendFriendRequest = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'User not found' });
    }

    recipient.friendRequests.push(req.userId);
    await recipient.save();

    // Emit event to notify recipient
    req.io.to(recipientId).emit('friendRequestReceived', {
      requesterId: req.userId,
      requesterName: req.user.name,
    });

    res.status(200).json({ message: 'Friend request sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.acceptFriendRequest = async (req, res) => {
  const { requestId } = req.body;

  try {
    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.recipient.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await User.findByIdAndUpdate(req.userId, { $push: { friends: request.requester }, $pull: { friendRequests: requestId } });
    await User.findByIdAndUpdate(request.requester, { $push: { friends: req.userId } });

    request.status = 'accepted';
    await request.save();

    res.status(200).json({ message: 'Friend request accepted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.declineFriendRequest = async (req, res) => {
  const { requestId } = req.body;

  try {
    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.recipient.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await User.findByIdAndUpdate(req.userId, { $pull: { friendRequests: requestId } });

    request.status = 'declined';
    await request.save();

    res.status(200).json({ message: 'Friend request declined' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getFriendRequests = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: 'friendRequests',
      populate: {
        path: 'requester',
        select: 'name email'
      }
    });

    res.status(200).json(user.friendRequests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
