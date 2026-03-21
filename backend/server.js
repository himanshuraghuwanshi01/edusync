import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

import userRoutes from './routes/users.js';
import matchRoutes from './routes/matches.js';
import sessionRoutes from './routes/sessions.js';
import setupSocketHandlers from './socket/index.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-frontend.vercel.app']
    : ['http://localhost:3000'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/sessions', sessionRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const io = new Server(httpServer, { cors: corsOptions });
setupSocketHandlers(io);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🤖 Ollama: ${process.env.OLLAMA_BASE_URL || 'http://localhost:11434'}`);
});