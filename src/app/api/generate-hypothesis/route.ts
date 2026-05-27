/* Generate Hypothesis API Route - Creates evaluation hypothesis from project info */

import { NextRequest } from 'next/server';
import { generateJSON } from '@/lib/gemini';

interface HypothesisRequest {
  projectName: string;
  targetModel: string;
  workflow: string;
  failureModes: string[];
  answers: Record<number, string>;
}

interface HypothesisResponse {
  hypothesis: string;
  taxonomy: string;
  badHeuristic: string;
  authorityInvariant: string;
  suggestedDomains: string[];
  questions?: Array<{ text: string; options: string[] }>;
}

const SYSTEM_PROMPT = `You are an expert AI evaluation designer. Given project details, generate a specific, testable evaluation hypothesis.

Return JSON with this exact structure:
{
  "hypothesis": "A 2-3 sentence hypothesis about a specific model weakness",
  "taxonomy": "The failure taxonomy category (e.g., Authority Ambiguity, Instruction Drift, Schema Hallucination)",
  "badHeuristic": "What the model does wrong - the specific bad shortcut or heuristic it uses",
  "authorityInvariant": "What should always hold true - the invariant the model violates",
  "suggestedDomains": ["array of 3-4 most relevant domain IDs from: instruction_following, reasoning_logic, safety_alignment, knowledge_factuality, calibration_uncertainty, multilinguality, long_context, tool_use_agency"]
}

Be specific and technical. The hypothesis should be falsifiable.`;

export async function POST(request: NextRequest) {
  try {
    const body: HypothesisRequest = await request.json();

    const userPrompt = `Project: ${body.projectName}
Target Model: ${body.targetModel}
Workflow: ${body.workflow || 'General evaluation'}
Failure Modes of Interest: ${body.failureModes?.join(', ') || 'All'}
User Preferences: ${Object.entries(body.answers || {}).map(([k, v]) => `Q${Number(k) + 1}: ${v}`).join(', ')}`;

    const result = await generateJSON<HypothesisResponse>(SYSTEM_PROMPT, userPrompt, {
      temperature: 0.5,
    });

    return Response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to generate hypothesis';
    return Response.json({ error: message }, { status: 500 });
  }
}
