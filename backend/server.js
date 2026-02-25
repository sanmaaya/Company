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

// In-memory message store (persists during server session)
const messages = {}; // { roomId: [{ sender, senderName, text, time }] }
const onlineUsers = {}; // { socketId: { userId, name, role } }

io.on('connection', (socket) => {
  console.log('🟢 Socket connected:', socket.id);

  // User comes online
  socket.on('user:online', ({ userId, name, role, profilePic }) => {
    onlineUsers[socket.id] = { userId, name, role, profilePic };
    io.emit('users:online', Object.values(onlineUsers));
  });

  // Join a room (direct message between two users)
  socket.on('room:join', ({ roomId }) => {
    socket.join(roomId);
    // Send message history
    socket.emit('messages:history', messages[roomId] || []);
  });

  // Send a message
  socket.on('message:send', ({ roomId, senderId, senderName, senderPic, text }) => {
    const msg = {
      id: Date.now(),
      senderId,
      senderName,
      senderPic,
      text,
      time: new Date().toISOString()
    };
    if (!messages[roomId]) messages[roomId] = [];
    messages[roomId].push(msg);
    // Keep last 100 messages per room
    if (messages[roomId].length > 100) messages[roomId].shift();
    io.to(roomId).emit('message:new', msg);
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
