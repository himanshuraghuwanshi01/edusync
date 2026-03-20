import express from 'express';
import Session from '../models/Session.js';
import Match from '../models/Match.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/sessions – Create a new study session
 */
router.post('/', requireAuth, async (req, res) => {
  try {
    const { matchId } = req.body;

    const match = await Match.findOne({
      _id: matchId,
      users: req.user._id,
      status: 'accepted'
    });

    if (!match) {
      return res.status(404).json({ error: 'Match not found or not accepted' });
    }

    const existing = await Session.findOne({
      match: matchId,
      status: 'active'
    });

    if (existing) {
      return res.status(400).json({ error: 'Active session already exists', session: existing });
    }

    const session = await Session.create({
      match: matchId,
      participants: match.users,
      status: 'active'
    });

    await session.populate('participants', 'name avatar');
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/sessions/active – Get user's active session
 */
router.get('/active', requireAuth, async (req, res) => {
  try {
    const session = await Session.findOne({
      participants: req.user._id,
      status: 'active'
    })
      .populate('participants', 'name avatar')
      .populate('match');

    res.json(session || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/sessions/:sessionId/end – End a session
 */
router.post('/:sessionId/end', requireAuth, async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.sessionId,
      participants: req.user._id,
      status: 'active'
    });

    if (!session) {
      return res.status(404).json({ error: 'Active session not found' });
    }

    session.status = 'completed';
    session.endTime = new Date();
    await session.save();

    res.json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /api/sessions/:sessionId/feedback – Submit feedback
 */
router.post('/:sessionId/feedback', requireAuth, async (req, res) => {
  try {
    const { rating, comment, tags } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be 1-5' });
    }

    const session = await Session.findOne({
      _id: req.params.sessionId,
      participants: req.user._id
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.feedback.some(f => f.user.toString() === req.user._id.toString())) {
      return res.status(400).json({ error: 'Feedback already submitted' });
    }

    session.feedback.push({
      user: req.user._id,
      rating,
      comment: comment || '',
      tags: tags || []
    });

    await session.save();
    res.json({ message: 'Feedback submitted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;