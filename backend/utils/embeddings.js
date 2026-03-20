import axios from 'axios';

/**
 * Generate embeddings using Hugging Face's free API
 * @param {string} text - Text to generate embedding for
 * @returns {Promise<Array|null>} - Embedding vector or null if failed
 */
export async function generateEmbedding(text) {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2',
      { inputs: text, options: { wait_for_model: true } },
      {
        headers: { Authorization: `Bearer ${process.env.HF_TOKEN}` },
        timeout: 10000
      }
    );
    return response.data; // array of numbers
  } catch (error) {
    console.error('Hugging Face API error:', error.message);
    return null; // fallback – matching will skip embedding similarity
  }
}

/**
 * Generate embedding for a user by combining bio, subjects, and learning style.
 * @param {Object} userData - Contains bio, subjects array, learningStyle object
 * @returns {Promise<Array|null>}
 */
export async function generateUserEmbedding(userData) {
  // Build a text representation
  const subjectsText = (userData.subjects || [])
    .map(s => `${s.name} (${s.level || 'beginner'})`)
    .join(', ');

  const learningStyleText = Object.entries(userData.learningStyle || {})
    .filter(([_, val]) => val)
    .map(([key]) => key)
    .join(', ');

  const textToEmbed = `Bio: ${userData.bio || ''}. Subjects: ${subjectsText}. Learning style: ${learningStyleText}`.trim();

  if (!textToEmbed || textToEmbed === 'Bio: . Subjects: . Learning style: ') {
    return null;
  }

  return await generateEmbedding(textToEmbed);
}