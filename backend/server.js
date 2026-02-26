const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const Message = require('./models/Message');

// Online users store (persists during server session)
const onlineUsers = {}; // { socketId: { userId, name, role } }

io.on('connection', (socket) => {
  console.log('🟢 Socket connected:', socket.id);

  // User comes online
  socket.on('user:online', ({ userId, name, role, profilePic }) => {
    onlineUsers[socket.id] = { userId, name, role, profilePic };
    io.emit('users:online', Object.values(onlineUsers));
  });

  // Subscribe to background rooms for notifications
  socket.on('rooms:subscribe', ({ rooms }) => {
    if (Array.isArray(rooms)) {
      rooms.forEach(roomId => socket.join(roomId));
    }
  });

  // Join a room actively (fetches history)
  socket.on('room:join', async ({ roomId }) => {
    socket.join(roomId);
    try {
      // Fetch last 50 messages from DB
      const history = await Message.find({ roomId })
        .sort({ createdAt: -1 })
        .limit(50);

      socket.emit('messages:history', history.reverse());
    } catch (err) {
      console.error('Error fetching chat history:', err);
    }
  });

  // Mark messages as read
  socket.on('messages:read', async ({ roomId, userId }) => {
    try {
      await Message.updateMany(
        { roomId, senderId: { $ne: userId }, readBy: { $ne: userId } },
        { $addToSet: { readBy: userId } }
      );
    } catch (err) {
      console.error('Error marking messages read:', err);
    }
  });

  // Send a message
  socket.on('message:send', async ({ roomId, senderId, senderName, senderPic, text }) => {
    try {
      const newMessage = await Message.create({
        roomId,
        senderId,
        senderName,
        senderPic,
        text
      });

      io.to(roomId).emit('message:new', newMessage);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  // Typing indicator
  socket.on('typing:start', ({ roomId, name }) => {
    socket.to(roomId).emit('typing:update', { name, typing: true });
  });
  socket.on('typing:stop', ({ roomId }) => {
    socket.to(roomId).emit('typing:update', { typing: false });
  });

  socket.on('disconnect', () => {
    delete onlineUsers[socket.id];
    io.emit('users:online', Object.values(onlineUsers));
    console.log('🔴 Socket disconnected:', socket.id);
  });
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'EmployeeSync API is running', sockets: Object.keys(onlineUsers).length });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const connectDB = require('./config/db');
connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} with Socket.io`);
});

module.exports = app;
