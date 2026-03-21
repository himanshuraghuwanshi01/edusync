import express from 'express';
import { Match } from '../models/Match.js';
import { requireAuth } from '../middleware/auth.js';
import { findMatchesForUser, calculateMatchScore } from '../utils/matching.js';

const router = express.Router();

router.get('/recommendations', requireAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const matches = await findMatchesForUser(req.user.id, limit);
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const existing = await Match.findByUsers(req.user.id, targetUserId);
    if (existing) {
      return res.status(400).json({ error: 'Match already exists', match: existing });
    }

    const score = await calculateMatchScore(req.user.id, targetUserId);
    const match = await Match.create({
      user1_id: req.user.id,
      user2_id: targetUserId,
      compatibility_score: score,
      initiated_by: req.user.id,
      status: 'pending'
    });

    res.status(201).json(match);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:matchId/status', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted','rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const match = await Match.findById(req.params.matchId);
    if (!match) return res.status(404).json({ error: 'Match not found' });
    if (match.user1_id !== req.user.id && match.user2_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updated = await Match.updateStatus(req.params.matchId, status);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/my-matches', requireAuth, async (req, res) => {
  try {
    const matches = await Match.getUserMatches(req.user.id);
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;