import Session from '../models/Session.js';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function callAITutor(question, sessionId) {
  try {
    const session = await Session.findById(sessionId).populate('participants', 'name subjects');
    const subjects = [...new Set(session?.participants.flatMap(p => p.subjects.map(s => s.name)))]
      .join(', ') || 'various subjects';

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an AI tutor helping students studying ${subjects}. Keep answers concise, educational, and encouraging.`
        },
        { role: 'user', content: question }
      ],
      max_tokens: 200,
      temperature: 0.7
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI error:', error);
    return "That's a great question! Why not discuss it with your study partner?";
  }
}

export default function setupSocketHandlers(io) {
  // Authentication middleware for sockets
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication required'));

      const admin = await import('../config/firebase.js').then(m => m.default);
      const decoded = await admin.auth().verifyIdToken(token);
      const User = (await import('../models/User.js')).default;
      const user = await User.findOne({ firebaseUid: decoded.uid });
      if (!user) return next(new Error('User not found'));

      socket.user = user;
      socket.userId = user._id.toString();
      next();
    } catch (err) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.user.name}`);

    socket.on('join-session', async (sessionId) => {
      try {
        const session = await Session.findOne({
          _id: sessionId,
          participants: socket.userId
        });
        if (!session) {
          socket.emit('error', { message: 'Not authorized to join this session' });
          return;
        }

        socket.join(`session:${sessionId}`);
        socket.currentSession = sessionId;
        socket.to(`session:${sessionId}`).emit('user-joined', {
          userId: socket.userId,
          name: socket.user.name
        });
      } catch (error) {
        socket.emit('error', { message: 'Failed to join session' });
      }
    });

    socket.on('send-message', async (data) => {
      const { sessionId, text } = data;
      if (!sessionId || !text) return;

      const session = await Session.findById(sessionId);
      if (!session) return;

      const message = {
        sender: socket.userId,
        text,
        timestamp: new Date(),
        isAI: false
      };
      session.messages.push(message);
      await session.save();

      // Broadcast to all in session
      io.to(`session:${sessionId}`).emit('new-message', {
        ...message,
        sender: { _id: socket.userId, name: socket.user.name, avatar: socket.user.avatar }
      });

      // Handle AI tutor command
      if (text.toLowerCase().startsWith('/ask ')) {
        const question = text.substring(5).trim();
        io.to(`session:${sessionId}`).emit('ai-typing', true);
        const aiResponse = await callAITutor(question, sessionId);
        io.to(`session:${sessionId}`).emit('ai-typing', false);

        const aiMessage = {
          text: aiResponse,
          timestamp: new Date(),
          isAI: true,
          sender: { name: 'AI Tutor', isAI: true }
        };
        session.messages.push({ text: aiResponse, timestamp: new Date(), isAI: true });
        await session.save();
        io.to(`session:${sessionId}`).emit('new-message', aiMessage);
      }
    });

    socket.on('typing', ({ sessionId, isTyping }) => {
      if (sessionId && socket.rooms.has(`session:${sessionId}`)) {
        socket.to(`session:${sessionId}`).emit('user-typing', {
          userId: socket.userId,
          name: socket.user.name,
          isTyping
        });
      }
    });

    socket.on('leave-session', (sessionId) => {
      socket.leave(`session:${sessionId}`);
      socket.to(`session:${sessionId}`).emit('user-left', {
        userId: socket.userId,
        name: socket.user.name
      });
    });

    socket.on('disconnect', () => {
      if (socket.currentSession) {
        socket.to(`session:${socket.currentSession}`).emit('user-left', {
          userId: socket.userId,
          name: socket.user.name
        });
      }
      console.log(`🔌 User disconnected: ${socket.user.name}`);
    });
  });
}