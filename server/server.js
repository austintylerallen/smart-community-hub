// server.js or index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Attach io to the request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Use the auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Use the newsfeed routes
const newsfeedRoutes = require('./routes/newsfeed');
app.use('/api/newsfeed', newsfeedRoutes);

// Use the post routes
const postRoutes = require('./routes/posts');
app.use('/api/posts', postRoutes);

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 4001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
