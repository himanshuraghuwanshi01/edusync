import express from 'express';
import { User } from '../models/User.js';
import { generateUserEmbedding } from '../utils/ollamaClient.js';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Middleware: require auth (Firebase token) – we'll reuse the same auth middleware but now we query Supabase
// For simplicity, we assume a middleware 'requireAuth' that attaches user from Firebase token.
// We'll keep the same auth.js but replace MongoDB queries with Supabase.
import { requireAuth } from '../middleware/auth.js';

router.get('/profile', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/profile', requireAuth, async (req, res) => {
  try {
    const updates = req.body;
    if (updates.bio || updates.subjects || updates.learning_style) {
      const embedding = await generateUserEmbedding({
        bio: updates.bio || req.user.bio,
        subjects: updates.subjects || req.user.subjects,
        learningStyle: updates.learning_style || req.user.learning_style
      });
      if (embedding) updates.embedding = embedding;
    }

    // Update subjects and availability separately if needed
    if (updates.subjects) {
      // Delete old and insert new subjects
      await supabase.from('subjects').delete().eq('user_id', req.user.id);
      const newSubjects = updates.subjects.map(s => ({ user_id: req.user.id, name: s.name, level: s.level }));
      await supabase.from('subjects').insert(newSubjects);
      delete updates.subjects;
    }

    if (updates.availability) {
      await supabase.from('availability').delete().eq('user_id', req.user.id);
      const newAvail = updates.availability.map(a => ({ user_id: req.user.id, day: a.day, start_time: a.startTime, end_time: a.endTime }));
      await supabase.from('availability').insert(newAvail);
      delete updates.availability;
    }

    const user = await User.update(req.user.id, updates);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;