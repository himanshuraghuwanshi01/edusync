const axios = require('axios');

async function generateEmbedding(text) {
  // Using a free model from Hugging Face (all-MiniLM-L6-v2)
  const response = await axios.post(
    'https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2',
    { inputs: text },
    { headers: { Authorization: `Bearer ${process.env.HF_TOKEN}` } }
  );
  return response.data; // array of numbers
}

module.exports = { generateEmbedding };