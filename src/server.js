const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const redisClient = require('./config/redis'); // Redis Client for Caching
const authRoutes = require('./routes/authRoutes');
const clubRoutes = require('./routes/clubRoutes');
const roomRoutes = require('./routes/roomRoutes');
const messageRoutes = require('./routes/messageRoutes');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors'); // Import CORS middleware
const eventRoutes = require('./routes/eventRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const scheduleNotifications = require('./cron/scheduleNotifications'); // Import the cron task

dotenv.config();

// Connect to the database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Restrict to your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json());
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // 100 requests per 15 minutes

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/notifications', notificationRoutes);

// Start the notification scheduler
scheduleNotifications.start();

// Socket.IO Logic with WebRTC Signaling and Improved Event Handling
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
    socket.to(roomId).emit('user-connected', socket.id);
  });

  // WebRTC signaling: exchanging offers, answers, and ICE candidates
  socket.on('webrtc-offer', (data) => {
    try {
      socket.to(data.roomId).emit('webrtc-offer', {
        sdp: data.sdp,
        senderId: socket.id,
      });
    } catch (err) {
      console.error('WebRTC Offer Error:', err);
    }
  });

  socket.on('webrtc-answer', (data) => {
    try {
      socket.to(data.roomId).emit('webrtc-answer', {
        sdp: data.sdp,
        senderId: socket.id,
      });
    } catch (err) {
      console.error('WebRTC Answer Error:', err);
    }
  });

  socket.on('webrtc-ice-candidate', (data) => {
    try {
      socket.to(data.roomId).emit('webrtc-ice-candidate', {
        candidate: data.candidate,
        senderId: socket.id,
      });
    } catch (err) {
      console.error('WebRTC ICE Candidate Error:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Notify only the rooms the user was part of
    const rooms = Array.from(socket.rooms);
    rooms.forEach((roomId) => {
      socket.to(roomId).emit('user-disconnected', socket.id);
    });
  });
});

// Error Handling for Routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

// Graceful Shutdown Handling
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await redisClient.quit(); // Close Redis client connection on shutdown
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Utility function for caching role checks using Redis
async function getCachedRole(userId, roomId) {
  const cacheKey = `role:${userId}:${roomId}`;
  let role = await redisClient.get(cacheKey);

  if (!role) {
    // Role not in cache, fetch from the database
    try {
      const Role = require('./models/roleModel');
      const roleData = await Role.findOne({ user: userId, room: roomId });

      if (roleData) {
        role = roleData.role;
        // Cache the role with a 1-hour expiration
        await redisClient.set(cacheKey, role, { EX: 3600 });
      }
    } catch (error) {
      console.error('Error fetching role from database:', error);
    }
  }

  return role;
}
