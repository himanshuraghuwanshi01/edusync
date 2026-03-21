import { callAITutor } from './utils/ollamaClient.js';

async function test() {
  try {
    const response = await callAITutor("What is a neural network?");
    console.log("Ollama says:", response);
  } catch (error) {
    console.error("Error calling Ollama:", error);
  }
}

test();