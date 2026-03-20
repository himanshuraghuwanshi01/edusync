import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

// Import route handlers
import userRoutes from './routes/users.js';
import matchRoutes from './routes/matches.js';
import sessionRoutes from './routes/sessions.js';
// If you have an auth.js route, import it too:
// import authRoutes from './routes/auth.js';

// Import socket setup
import setupSocketHandlers from './socket/index.js';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);

// CORS configuration – allow your frontend origin(s)
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-frontend.vercel.app']   // Replace with your actual frontend URL
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging (optional, useful for debugging)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Mount API routes
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/sessions', sessionRoutes);


// Health check endpoint (useful for uptime monitors)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    env: process.env.NODE_ENV 
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully');
    
    // Optional: create indexes for better performance
    await mongoose.connection.db.collection('users').createIndex({ firebaseUid: 1 });
    console.log('✅ Database indexes created');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1); // Exit if database fails to connect
  }
};

// Socket.io setup
const io = new Server(httpServer, {
  cors: corsOptions,
  transports: ['websocket', 'polling'] // ensure compatibility
});

// Attach io instance to app (so routes can access it if needed)
app.set('io', io);

// Set up socket event handlers (defined in socket/index.js)
setupSocketHandlers(io);

// Start server only after DB connects
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 WebSocket server ready`);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    mongoose.connection.close(false, () => {
      process.exit(0);
    });
  });
});

export default app; // for testing purposes (optional)