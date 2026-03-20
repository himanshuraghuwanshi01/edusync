import express from 'express';
import Match from '../models/Match.js';
import { requireAuth } from '../middleware/auth.js';
import { findMatchesForUser, calculateMatchScore } from '../utils/matching.js';

const router = express.Router();

/**
 * GET /api/matches/recommendations – Get match recommendations
 */
router.get('/recommendations', requireAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const matches = await findMatchesForUser(req.user._id, limit);
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/matches – Create a new match (connect)
 */
router.post('/', requireAuth, async (req, res) => {
  try {
    const { targetUserId } = req.body;

    const existing = await Match.findOne({
      users: { $all: [req.user._id, targetUserId] }
    });

    if (existing) {
      return res.status(400).json({ error: 'Match already exists', match: existing });
    }

    const score = await calculateMatchScore(req.user._id, targetUserId);
    const match = await Match.create({
      users: [req.user._id, targetUserId],
      compatibilityScore: score,
      initiatedBy: req.user._id
    });

    await match.populate('users', 'name email subjects avatar');
    res.status(201).json(match);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * PUT /api/matches/:matchId/status – Update match status (accept/reject)
 */
router.put('/:matchId/status', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const match = await Match.findById(req.params.matchId);
    if (!match) return res.status(404).json({ error: 'Match not found' });

    if (!match.users.includes(req.user._id)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    match.status = status;
    await match.save();
    res.json(match);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/matches/my-matches – Get user's accepted matches
 */
router.get('/my-matches', requireAuth, async (req, res) => {
  try {
    const matches = await Match.find({
      users: req.user._id,
      status: 'accepted'
    })
      .populate('users', 'name subjects avatar')
      .sort('-createdAt');

    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;