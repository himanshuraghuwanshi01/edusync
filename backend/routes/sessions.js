import express from 'express';
import { Session } from '../models/Session.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get current active session
router.get('/active', requireAuth, async (req, res) => {
  try {
    const session = await Session.findActiveByUser(req.user.id);
    res.json(session || { message: 'No active session' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new session from match
router.post('/', requireAuth, async (req, res) => {
  try {
    const { matchId } = req.body;
    if (!matchId) return res.status(400).json({ error: 'matchId required' });

    // Check if session already exists for this match
    let session = await Session.findActiveByMatch(matchId);
    
    if (!session) {
      session = await Session.create({
        match_id: matchId,
        status: 'active',
        start_time: new Date()
      });
    }

    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// End session
router.post('/:id/end', requireAuth, async (req, res) => {
  try {
    const session = await Session.endSession(req.params.id);
    res.json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;