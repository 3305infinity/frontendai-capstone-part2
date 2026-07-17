import { createGoogleGenerativeAI } from "@ai-sdk/google";

/**
 * Retrieves the Google AI SDK provider configured with the server-side API key.
 * Returns null if no API key is available in the environment variables.
 */
export function getGoogleProvider() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  
  if (!apiKey) {
    return null;
  }

  return createGoogleGenerativeAI({
    apiKey,
  });
}

/**
 * Utility to check if a valid Gemini/Google API key is configured.
 */
export function isApiKeyConfigured(): boolean {
  return !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY);
}
