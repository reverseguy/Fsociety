import { GoogleGenAI } from "@google/genai";
import { CHAOS_LINES, RELIEF_LINES } from "../constants";

let ai: GoogleGenAI | null = null;

// Initialize conditionally to avoid errors if env is missing in some environments
try {
  if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
} catch (e) {
  console.warn("Gemini API Key missing or invalid initialization.");
}

export const getChaosMessage = async (type: 'chaos' | 'relief' = 'chaos'): Promise<string> => {
  const fallbackList = type === 'chaos' ? CHAOS_LINES : RELIEF_LINES;
  
  if (!ai) {
    // Fallback if no API key
    return fallbackList[Math.floor(Math.random() * fallbackList.length)];
  }

  try {
    const prompt = type === 'chaos' 
      ? "Generate a short, empathetic reflection for someone struggling. Max 12 words. Do NOT give advice. Do NOT say 'it gets better'. Just acknowledge the feeling. Warm, deep, dark-comfort tone. Lowercase."
      : "Generate a short, calming sentence. Max 12 words. Very gentle. Acknowledge that it's okay to stop. Lowercase.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        maxOutputTokens: 30,
        temperature: 0.8, 
      }
    });
    return response.text?.trim().toLowerCase() || fallbackList[0];
  } catch (error) {
    console.error("Gemini Error:", error);
    return fallbackList[Math.floor(Math.random() * fallbackList.length)];
  }
};

export const checkSafety = async (text: string): Promise<{ safe: boolean; reason?: string }> => {
  if (!ai) return { safe: true };

  // Soft soft guardrail check
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following text for: 1. Violent planning 2. Illegal instructions 3. Self-harm glorification.
      Text: "${text}"
      
      Return ONLY valid JSON: { "safe": boolean, "reason": "short explanation if unsafe" }`,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    const result = JSON.parse(response.text || '{}');
    return result.safe !== undefined ? result : { safe: true };
  } catch (e) {
    // If API fails, default to safe to not block user (unless regex triggers, handled in UI)
    return { safe: true };
  }
};