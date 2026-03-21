import ollama from 'ollama';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

export async function callAITutor(question, sessionContext = {}) {
  try {
    const { subjects = [] } = sessionContext;
    const subjectsText = subjects.length ? `They are studying: ${subjects.join(', ')}. ` : '';
    const systemPrompt = `You are an AI tutor helping students in a study session. ${subjectsText}
Keep answers concise (max 2-3 sentences), educational, and encouraging. 
If you don't know something, suggest they discuss it with their study partner.`;

    const response = await ollama.chat({
      model: OLLAMA_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question }
      ],
      options: { temperature: 0.7, max_tokens: 200 }
    });
    return response.message.content;
  } catch (error) {
    console.error('Ollama error:', error);
    return "That's a great question! Why not discuss it with your study partner?";
  }
}

export async function generateEmbedding(text) {
  try {
    // Using nomic-embed-text (must be pulled)
    const response = await ollama.embeddings({
      model: 'nomic-embed-text',
      prompt: text
    });
    return response.embedding;
  } catch (error) {
    console.error('Ollama embedding error:', error);
    return null;
  }
}

export async function generateUserEmbedding(userData) {
  const subjectsText = (userData.subjects || [])
    .map(s => `${s.name} (${s.level || 'beginner'})`)
    .join(', ');
  const textToEmbed = `Bio: ${userData.bio || ''}. Subjects: ${subjectsText}.`;
  if (!textToEmbed.trim() || textToEmbed === 'Bio: . Subjects: ') return null;
  return await generateEmbedding(textToEmbed);
}