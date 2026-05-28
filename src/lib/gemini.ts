/* ================================================================
   Gemini API Client - Server-side only
   Used by API routes to interact with Google's Gemini API
   ================================================================ */

import { GoogleGenAI } from '@google/genai';

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required. Set it in your .env.local or Vercel project settings.');
  }
  return new GoogleGenAI({ apiKey });
}

export const GEMINI_MODEL = 'gemini-2.5-flash';

export async function generateText(
  systemPrompt: string,
  userPrompt: string,
  options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  const response = await getClient().models.generateContent({
    model: GEMINI_MODEL,
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt,
      temperature: options?.temperature ?? 0.7,
      maxOutputTokens: options?.maxTokens ?? 2048,
    },
  });

  return response.text ?? '';
}

export async function* streamText(
  systemPrompt: string,
  userPrompt: string,
  options?: { temperature?: number; maxTokens?: number }
): AsyncGenerator<string> {
  const response = await getClient().models.generateContentStream({
    model: GEMINI_MODEL,
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt,
      temperature: options?.temperature ?? 0.7,
      maxOutputTokens: options?.maxTokens ?? 4096,
    },
  });

  for await (const chunk of response) {
    const text = chunk.text;
    if (text) {
      yield text;
    }
  }
}

export async function generateJSON<T>(
  systemPrompt: string,
  userPrompt: string,
  options?: { temperature?: number }
): Promise<T> {
  const response = await getClient().models.generateContent({
    model: GEMINI_MODEL,
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt + '\n\nYou MUST respond with valid JSON only. No markdown, no code fences, no explanation. Just pure JSON.',
      temperature: options?.temperature ?? 0.3,
      responseMimeType: 'application/json',
    },
  });

  const text = response.text ?? '{}';
  return JSON.parse(text) as T;
}
