import express from 'express';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import { generateUserEmbedding } from '../utils/embeddings.js';

const router = express.Router();

/**
 * GET /api/users/profile – Get current user profile
 */
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-embedding');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/users/profile – Update user profile
 */
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const updates = req.body;
    delete updates._id;
    delete updates.firebaseUid;
    delete updates.createdAt;

    if (updates.bio || updates.subjects || updates.learningStyle) {
      const embedding = await generateUserEmbedding({
        bio: updates.bio || req.user.bio,
        subjects: updates.subjects || req.user.subjects,
        learningStyle: updates.learningStyle || req.user.learningStyle
      });
      if (embedding) updates.embedding = embedding;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { ...updates, lastActive: new Date() },
      { new: true, runValidators: true }
    ).select('-embedding');

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/users/:id – Get public profile by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name subjects bio avatar learningStyle');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;