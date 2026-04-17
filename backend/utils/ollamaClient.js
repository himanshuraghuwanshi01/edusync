import { Ollama } from 'ollama';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';
const SKIP_OLLAMA = process.env.SKIP_OLLAMA === 'true';

let ollama = null;
let ollamaAvailable = false;

// Initialize Ollama client
if (!SKIP_OLLAMA) {
  try {
    ollama = new Ollama({ baseUrl: OLLAMA_BASE_URL });
    ollamaAvailable = true;
    console.log('✅ Ollama client initialized');
  } catch (error) {
    console.warn('⚠️  Ollama initialization failed (continuing without AI features):', error.message);
    ollamaAvailable = false;
  }
}

export async function callAITutor(question, sessionContext = {}) {
  if (!ollamaAvailable || SKIP_OLLAMA) {
    // Fallback response when Ollama is not available
    return generateFallbackResponse(question, sessionContext);
  }

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
    });
    return response.message.content;
  } catch (error) {
    console.error('❌ Ollama chat error:', error.message);
    return generateFallbackResponse(question, sessionContext);
  }
}

export async function generateEmbedding(text) {
  if (!ollamaAvailable || SKIP_OLLAMA) {
    return null;
  }

  try {
    // Using nomic-embed-text (must be pulled: ollama pull nomic-embed-text)
    const response = await ollama.embeddings({
      model: 'nomic-embed-text',
      prompt: text
    });
    return response.embedding;
  } catch (error) {
    console.error('❌ Ollama embedding error:', error.message);
    return null;
  }
}

export async function generateUserEmbedding(userData) {
  try {
    const subjectsText = (userData.subjects || [])
      .map(s => `${s.name} (${s.level || 'beginner'})`)
      .join(', ');
    const textToEmbed = `Bio: ${userData.bio || ''}. Subjects: ${subjectsText}.`;
    
    if (!textToEmbed.trim() || textToEmbed === 'Bio: . Subjects: ') {
      return null;
    }
    
    return await generateEmbedding(textToEmbed);
  } catch (error) {
    console.error('❌ User embedding error:', error.message);
    return null;
  }
}

/**
 * Generate a helpful fallback response when Ollama is not available
 */
function generateFallbackResponse(question, sessionContext = {}) {
  const { subjects = [] } = sessionContext;
  
  // Simple keyword-based responses
  if (question.toLowerCase().includes('how') || question.toLowerCase().includes('explain')) {
    return "That's a great question! Try breaking it down into smaller parts. Your study partner might have a different perspective that could help.";
  }
  
  if (question.toLowerCase().includes('what') || question.toLowerCase().includes('define')) {
    return `For detailed definitions, I recommend discussing this with your study partner or checking your course materials. Working together, you'll understand it better!`;
  }
  
  if (question.toLowerCase().includes('why')) {
    return "Good critical thinking! This is perfect for a discussion with your study partner. Different viewpoints will help you both learn more.";
  }
  
  if (question.toLowerCase().includes('problem') || question.toLowerCase().includes('help')) {
    return "Let's work through this together! Can you break down the problem? Your study partner might spot something you missed.";
  }
  
  // Default response
  return "That's a thoughtful question! Why not discuss this with your study partner? Two perspectives are better than one for deeper learning.";
}

/**
 * Check if Ollama is available
 */
export function isOllamaAvailable() {
  return ollamaAvailable && !SKIP_OLLAMA;
}

/**
 * Get Ollama status
 */
export function getOllamaStatus() {
  return {
    available: isOllamaAvailable(),
    baseUrl: OLLAMA_BASE_URL,
    model: OLLAMA_MODEL,
    skipOllama: SKIP_OLLAMA,
  };
}
