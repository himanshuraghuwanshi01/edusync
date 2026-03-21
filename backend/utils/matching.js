import { supabase } from '../config/supabase.js';
import { generateEmbedding } from './ollamaClient.js';

function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return normA && normB ? dot / (Math.sqrt(normA) * Math.sqrt(normB)) : 0;
}

function calculateSubjectScore(userSubs, otherSubs) {
  if (!userSubs?.length || !otherSubs?.length) return 0;
  let total = 0;
  const levelMap = { beginner: 1, intermediate: 2, advanced: 3 };
  for (const us of userSubs) {
    for (const os of otherSubs) {
      if (us.name.toLowerCase() === os.name.toLowerCase()) {
        const diff = Math.abs((levelMap[us.level]||1) - (levelMap[os.level]||1));
        if (diff === 0) total += 1;
        else if (diff === 1) total += 0.7;
        else total += 0.4;
      }
    }
  }
  const max = Math.min(userSubs.length, otherSubs.length);
  return max ? total / max : 0;
}

function calculateAvailabilityScore(userAvail, otherAvail) {
  if (!userAvail?.length || !otherAvail?.length) return 0;
  const toMinutes = t => t.split(':').reduce((h,m) => h*60 + +m, 0);
  let overlap = 0, total = 0;
  for (const u of userAvail) {
    const uStart = toMinutes(u.start_time), uEnd = toMinutes(u.end_time);
    total += (uEnd - uStart);
    for (const o of otherAvail) {
      if (u.day !== o.day) continue;
      const oStart = toMinutes(o.start_time), oEnd = toMinutes(o.end_time);
      const start = Math.max(uStart, oStart), end = Math.min(uEnd, oEnd);
      if (end > start) overlap += (end - start);
    }
  }
  return total ? overlap / total : 0;
}

export async function findMatchesForUser(userId, limit = 10) {
  // Fetch user
  const { data: user, error: uError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  if (uError) throw new Error('User not found');

  // Fetch user's subjects and availability
  const { data: userSubjects } = await supabase
    .from('subjects')
    .select('*')
    .eq('user_id', userId);
  user.subjects = userSubjects || [];

  const { data: userAvailability } = await supabase
    .from('availability')
    .select('*')
    .eq('user_id', userId);
  user.availability = userAvailability || [];

  // Fetch other users
  const { data: candidates } = await supabase
    .from('users')
    .select('*')
    .neq('id', userId)
    .limit(100);

  const matches = [];
  for (const candidate of candidates) {
    // Get candidate's subjects and availability
    const { data: candidateSubjects } = await supabase
      .from('subjects')
      .select('*')
      .eq('user_id', candidate.id);
    candidate.subjects = candidateSubjects || [];

    const { data: candidateAvailability } = await supabase
      .from('availability')
      .select('*')
      .eq('user_id', candidate.id);
    candidate.availability = candidateAvailability || [];

    // Scores
    const subjectScore = calculateSubjectScore(user.subjects, candidate.subjects);
    const availabilityScore = calculateAvailabilityScore(user.availability, candidate.availability);

    let learningStyleScore = 0;
    if (user.learning_style && candidate.learning_style) {
      const userStyles = Object.entries(user.learning_style).filter(([_, v]) => v).map(([k]) => k);
      const candStyles = Object.entries(candidate.learning_style).filter(([_, v]) => v).map(([k]) => k);
      if (userStyles.length && candStyles.length) {
        const common = userStyles.filter(style => candidate.learning_style[style]).length;
        learningStyleScore = common / Math.max(userStyles.length, candStyles.length);
      }
    }

    let embeddingScore = 0;
    if (user.embedding && candidate.embedding) {
      embeddingScore = cosineSimilarity(user.embedding, candidate.embedding);
    }

    const totalScore = Math.round(
      (subjectScore * 0.4 + availabilityScore * 0.3 + learningStyleScore * 0.15 + embeddingScore * 0.15) * 100
    );

    if (totalScore >= 30) {
      matches.push({
        user: {
          id: candidate.id,
          name: candidate.name,
          email: candidate.email,
          subjects: candidate.subjects,
          avatar: candidate.avatar,
          bio: candidate.bio,
          learning_style: candidate.learning_style
        },
        score: totalScore,
        breakdown: {
          subject: Math.round(subjectScore * 100),
          availability: Math.round(availabilityScore * 100),
          learningStyle: Math.round(learningStyleScore * 100),
          embedding: Math.round(embeddingScore * 100)
        }
      });
    }
  }
  return matches.sort((a,b) => b.score - a.score).slice(0, limit);
}

export async function calculateMatchScore(userId1, userId2) {
  // Reuse the same logic but only for two users
  const { data: user1 } = await supabase.from('users').select('*').eq('id', userId1).single();
  const { data: user2 } = await supabase.from('users').select('*').eq('id', userId2).single();
  if (!user1 || !user2) throw new Error('Users not found');

  const { data: subjects1 } = await supabase.from('subjects').select('*').eq('user_id', userId1);
  const { data: subjects2 } = await supabase.from('subjects').select('*').eq('user_id', userId2);
  user1.subjects = subjects1 || [];
  user2.subjects = subjects2 || [];

  const { data: avail1 } = await supabase.from('availability').select('*').eq('user_id', userId1);
  const { data: avail2 } = await supabase.from('availability').select('*').eq('user_id', userId2);
  user1.availability = avail1 || [];
  user2.availability = avail2 || [];

  const subjectScore = calculateSubjectScore(user1.subjects, user2.subjects);
  const availabilityScore = calculateAvailabilityScore(user1.availability, user2.availability);

  let learningStyleScore = 0;
  if (user1.learning_style && user2.learning_style) {
    const styles1 = Object.entries(user1.learning_style).filter(([_, v]) => v).map(([k]) => k);
    const styles2 = Object.entries(user2.learning_style).filter(([_, v]) => v).map(([k]) => k);
    if (styles1.length && styles2.length) {
      const common = styles1.filter(style => user2.learning_style[style]).length;
      learningStyleScore = common / Math.max(styles1.length, styles2.length);
    }
  }

  let embeddingScore = 0;
  if (user1.embedding && user2.embedding) {
    embeddingScore = cosineSimilarity(user1.embedding, user2.embedding);
  }

  return Math.round(
    (subjectScore * 0.4 + availabilityScore * 0.3 + learningStyleScore * 0.15 + embeddingScore * 0.15) * 100
  );
}