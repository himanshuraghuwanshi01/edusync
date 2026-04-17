import { supabase } from '../config/supabase.js';
import { callAITutor } from '../utils/ollamaClient.js';

export default function setupSocketHandlers(io) {
  io.use(async (socket, next) => {
    try {
      const { userId } = socket.handshake.auth;
      if (!userId) return next(new Error('Authentication required (userId)'));

      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error || !user) return next(new Error('User not found'));

      socket.user = user;
      socket.userId = user.id;
      next();
    } catch (err) {
      console.error('Socket auth error:', err);
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.user.name} (${socket.userId})`);

    socket.on('join-session', async (sessionId) => {
      try {
        // Verify user belongs to the session's match
        const { data: session, error } = await supabase
          .from('sessions')
          .select('match_id')
          .eq('id', sessionId)
          .single();
        if (error) return socket.emit('error', { message: 'Session not found' });

        const { data: match } = await supabase
          .from('matches')
          .select('user1_id, user2_id')
          .eq('id', session.match_id)
          .single();
        if (!match || (match.user1_id !== socket.userId && match.user2_id !== socket.userId)) {
          return socket.emit('error', { message: 'Not authorized' });
        }

        socket.join(`session:${sessionId}`);
        socket.currentSession = sessionId;
        socket.to(`session:${sessionId}`).emit('user-joined', { userId: socket.userId, name: socket.user.name });
      } catch (err) {
        console.error('join-session error:', err);
        socket.emit('error', { message: 'Failed to join session' });
      }
    });

    socket.on('send-message', async (data) => {
      try {
        const { sessionId, text } = data;
        if (!sessionId || !text) return;

        // Save message
        const message = {
          session_id: sessionId,
          sender_id: socket.userId,
          text,
          is_ai: false
        };
        const { data: savedMsg, error } = await supabase.from('messages').insert([message]).select().single();
        if (error) {
          console.error('Message save error:', error);
          return;
        }

        io.to(`session:${sessionId}`).emit('new-message', {
          ...savedMsg,
          sender: { id: socket.userId, name: socket.user.name, avatar: socket.user.avatar }
        });

        // AI tutor if command starts with /ask
        if (text.toLowerCase().startsWith('/ask ')) {
          const question = text.substring(5).trim();
          io.to(`session:${sessionId}`).emit('ai-typing', true);

          // Get session context: subjects from both participants
          const sessionData = await supabase.from('sessions').select('match_id').eq('id', sessionId).single();
          const { data: match } = await supabase
            .from('matches')
            .select('user1_id, user2_id')
            .eq('id', sessionData.data.match_id)
            .single();
          const userIds = [match.user1_id, match.user2_id];
          const { data: subjects } = await supabase
            .from('subjects')
            .select('name')
            .in('user_id', userIds);
          const subjectNames = [...new Set(subjects.map(s => s.name))];

          const aiResponse = await callAITutor(question, { subjects: subjectNames });
          io.to(`session:${sessionId}`).emit('ai-typing', false);

          const aiMessage = {
            session_id: sessionId,
            text: aiResponse,
            is_ai: true,
            sender_id: null
          };
          const { data: savedAi } = await supabase.from('messages').insert([aiMessage]).select().single();
          io.to(`session:${sessionId}`).emit('new-message', {
            ...savedAi,
            sender: { name: 'AI Tutor', isAI: true }
          });
        }
      } catch (err) {
        console.error('send-message error:', err);
        socket.emit('error', { message: 'Failed to send message' });
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
      console.log(`❌ User disconnected: ${socket.user.name}`);
    });
  });
}
