const Friend = require('../models/Friend');
const User = require('../models/User');

exports.sendFriendRequest = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const friendRequest = await Friend.create({
      requester: req.userId,
      recipient: recipientId
    });
    res.status(200).json(friendRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.acceptFriendRequest = async (req, res) => {
  try {
    const { requesterId } = req.body;
    const friendRequest = await Friend.findOneAndUpdate(
      { requester: requesterId, recipient: req.userId, status: 'pending' },
      { status: 'accepted', updatedAt: Date.now() },
      { new: true }
    );
    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    await User.findByIdAndUpdate(req.userId, { $push: { friends: requesterId } });
    await User.findByIdAndUpdate(requesterId, { $push: { friends: req.userId } });

    res.status(200).json(friendRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.declineFriendRequest = async (req, res) => {
  try {
    const { requesterId } = req.body;
    const friendRequest = await Friend.findOneAndUpdate(
      { requester: requesterId, recipient: req.userId, status: 'pending' },
      { status: 'declined', updatedAt: Date.now() },
      { new: true }
    );
    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }
    res.status(200).json(friendRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getFriendRequests = async (req, res) => {
  try {
    const friendRequests = await Friend.find({ recipient: req.userId, status: 'pending' }).populate('requester', 'name email');
    res.status(200).json(friendRequests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
