import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  subjects: [{
    name: { type: String, required: true },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' }
  }],
  availability: [{
    day: { type: String, enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] },
    startTime: String, // "HH:MM"
    endTime: String    // "HH:MM"
  }],
  timezone: { type: String, default: 'UTC' },
  bio: { type: String, maxlength: 500 },
  learningStyle: {
    visual: { type: Boolean, default: false },
    auditory: { type: Boolean, default: false },
    kinesthetic: { type: Boolean, default: false }
  },
  embedding: { type: [Number], default: undefined },
  avatar: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);