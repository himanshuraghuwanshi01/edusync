import admin from '../config/firebase.js';
import User from '../models/User.js';

/**
 * Middleware to require authentication – verifies Firebase token and loads user.
 * Attaches `req.user` (Mongoose document) and `req.firebaseUser` (decoded token).
 */
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Find or create user in our database
    let user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user) {
      // First time login – create basic profile
      user = await User.create({
        firebaseUid: decodedToken.uid,
        email: decodedToken.email || '',
        name: decodedToken.name || decodedToken.email?.split('@')[0] || 'User',
        subjects: [],
        availability: []
      });
    } else {
      user.lastActive = new Date();
      await user.save();
    }

    req.user = user;           // Mongoose document
    req.firebaseUser = decodedToken; // Raw Firebase data

    next();
  } catch (error) {
    console.error('Auth error:', error);
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}

/**
 * Optional authentication – does not error if no token, just sets req.user = null.
 * Useful for endpoints that can work with or without login.
 */
export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      const user = await User.findOne({ firebaseUid: decodedToken.uid });
      req.user = user;
      req.firebaseUser = decodedToken;
    }
  } catch (error) {
    // Silently ignore – treat as unauthenticated
  }
  next();
}