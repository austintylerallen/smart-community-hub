const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const User = require('./models/User');
const Notification = require('./models/Notification');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/comments', require('./routes/comments'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/newsfeed', require('./routes/newsfeed'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/users', require('./routes/user'));
app.use('/api/friends', require('./routes/friend'));
app.use('/api/notifications', require('./routes/notification'));

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('sendFriendRequest', async ({ recipientId, requesterId }) => {
    try {
      const recipient = await User.findById(recipientId);
      if (recipient) {
        recipient.friendRequests.push({ requester: requesterId });
        await recipient.save();

        const notification = new Notification({
          user: recipientId,
          type: 'friendRequest',
          message: `You have a new friend request from ${requesterId}`
        });
        await notification.save();

        socket.to(recipientId).emit('friendRequestReceived', { requesterId });
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  });

  socket.on('likePost', async ({ postId, likerId }) => {
    try {
      const post = await Post.findById(postId).populate('creator');
      if (post) {
        const notification = new Notification({
          user: post.creator._id,
          type: 'like',
          message: `${likerId} liked your post`
        });
        await notification.save();

        socket.to(post.creator._id.toString()).emit('postLiked', { postId, likerId });
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  });

  socket.on('commentPost', async ({ postId, commenterId }) => {
    try {
      const post = await Post.findById(postId).populate('creator');
      if (post) {
        const notification = new Notification({
          user: post.creator._id,
          type: 'comment',
          message: `${commenterId} commented on your post`
        });
        await notification.save();

        socket.to(post.creator._id.toString()).emit('postCommented', { postId, commenterId });
      }
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 4001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
