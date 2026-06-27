const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL, credentials: true }
});

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// Database connect
const startServer = async () => {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  console.log('✅ MongoDB Connected (Local Memory)');

  // Routes
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/gigs', require('./routes/gigRoutes'));
  app.use('/api/proposals', require('./routes/proposalRoutes'));
  app.use('/api/messages', require('./routes/messageRoutes'));
  app.use('/api/reviews', require('./routes/reviewRoutes'));
  app.use('/api/payments', require('./routes/paymentRoutes'));
  app.use('/api/admin', require('./routes/adminRoutes'));
  app.use('/api/profile', require('./routes/profileRoutes'));

  // Socket.IO
  require('./socket/socketHandler')(io);

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

startServer();