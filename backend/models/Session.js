import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  startTime: { type: Date, default: Date.now },
  endTime: Date,
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  messages: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    timestamp: { type: Date, default: Date.now },
    isAI: { type: Boolean, default: false }
  }],
  feedback: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    tags: [String],
    submittedAt: { type: Date, default: Date.now }
  }]
});

export default mongoose.model('Session', sessionSchema);