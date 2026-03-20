import User from '../models/User.js';

function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length || vecA.length === 0) return 0;
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function calculateSubjectScore(userSubjects, otherSubjects) {
  if (!userSubjects?.length || !otherSubjects?.length) return 0;
  let totalScore = 0;
  const levelMap = { beginner: 1, intermediate: 2, advanced: 3 };
  for (const us of userSubjects) {
    for (const os of otherSubjects) {
      if (us.name?.toLowerCase() === os.name?.toLowerCase()) {
        const userLevel = levelMap[us.level] || 1;
        const otherLevel = levelMap[os.level] || 1;
        const levelDiff = Math.abs(userLevel - otherLevel);
        if (levelDiff === 0) totalScore += 1;
        else if (levelDiff === 1) totalScore += 0.7;
        else totalScore += 0.4;
      }
    }
  }
  const maxPossible = Math.min(userSubjects.length, otherSubjects.length);
  return maxPossible > 0 ? totalScore / maxPossible : 0;
}

function calculateAvailabilityScore(userAvail, otherAvail) {
  if (!userAvail?.length || !otherAvail?.length) return 0;
  const toMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };
  let totalUserMinutes = 0, overlapMinutes = 0;
  for (const uSlot of userAvail) {
    const uStart = toMinutes(uSlot.startTime);
    const uEnd = toMinutes(uSlot.endTime);
    totalUserMinutes += (uEnd - uStart);
    for (const oSlot of otherAvail) {
      if (uSlot.day !== oSlot.day) continue;
      const oStart = toMinutes(oSlot.startTime);
      const oEnd = toMinutes(oSlot.endTime);
      const overlapStart = Math.max(uStart, oStart);
      const overlapEnd = Math.min(uEnd, oEnd);
      if (overlapEnd > overlapStart) overlapMinutes += (overlapEnd - overlapStart);
    }
  }
  return totalUserMinutes > 0 ? overlapMinutes / totalUserMinutes : 0;
}

export async function findMatchesForUser(userId, limit = 10) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  const candidates = await User.find({ _id: { $ne: userId }, firebaseUid: { $exists: true, $ne: null } });
  const matches = await Promise.all(candidates.map(async (candidate) => {
    const subjectScore = calculateSubjectScore(user.subjects, candidate.subjects);
    const availabilityScore = calculateAvailabilityScore(user.availability, candidate.availability);
    let learningStyleScore = 0;
    if (user.learningStyle && candidate.learningStyle) {
      const userStyles = Object.entries(user.learningStyle).filter(([_, v]) => v).map(([k]) => k);
      const candidateStyles = Object.entries(candidate.learningStyle).filter(([_, v]) => v).map(([k]) => k);
      if (userStyles.length && candidateStyles.length) {
        const common = userStyles.filter(style => candidate.learningStyle[style]).length;
        learningStyleScore = common / Math.max(userStyles.length, candidateStyles.length);
      }
    }
    let embeddingScore = 0;
    if (user.embedding && candidate.embedding) {
      embeddingScore = cosineSimilarity(user.embedding, candidate.embedding);
    }
    const totalScore = Math.round(
      (subjectScore * 0.4 + availabilityScore * 0.3 + learningStyleScore * 0.15 + embeddingScore * 0.15) * 100
    );
    return {
      user: {
        _id: candidate._id,
        name: candidate.name,
        email: candidate.email,
        subjects: candidate.subjects,
        avatar: candidate.avatar,
        bio: candidate.bio,
        learningStyle: candidate.learningStyle
      },
      score: totalScore,
      breakdown: {
        subject: Math.round(subjectScore * 100),
        availability: Math.round(availabilityScore * 100),
        learningStyle: Math.round(learningStyleScore * 100),
        embedding: Math.round(embeddingScore * 100)
      }
    };
  }));
  return matches.filter(m => m.score >= 30).sort((a,b) => b.score - a.score).slice(0, limit);
}

export async function calculateMatchScore(userId1, userId2) {
  const [user1, user2] = await Promise.all([User.findById(userId1), User.findById(userId2)]);
  if (!user1 || !user2) throw new Error('One or both users not found');
  const subjectScore = calculateSubjectScore(user1.subjects, user2.subjects);
  const availabilityScore = calculateAvailabilityScore(user1.availability, user2.availability);
  let learningStyleScore = 0;
  if (user1.learningStyle && user2.learningStyle) {
    const user1Styles = Object.entries(user1.learningStyle).filter(([_, v]) => v).map(([k]) => k);
    const user2Styles = Object.entries(user2.learningStyle).filter(([_, v]) => v).map(([k]) => k);
    if (user1Styles.length && user2Styles.length) {
      const common = user1Styles.filter(style => user2.learningStyle[style]).length;
      learningStyleScore = common / Math.max(user1Styles.length, user2Styles.length);
    }
  }
  let embeddingScore = 0;
  if (user1.embedding && user2.embedding) {
    embeddingScore = cosineSimilarity(user1.embedding, user2.embedding);
  }
  return Math.round((subjectScore*0.4 + availabilityScore*0.3 + learningStyleScore*0.15 + embeddingScore*0.15)*100);
}