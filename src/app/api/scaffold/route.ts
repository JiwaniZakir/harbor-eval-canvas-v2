/* Scaffold API Route - Generates evaluation scaffold artifacts */

import { NextRequest } from 'next/server';
import { generateJSON } from '@/lib/gemini';

interface ScaffoldRequest {
  domainId: string;
  domainLabel: string;
  targetModel: string;
  probeSummary: {
    weaknessTitle: string;
    aggregateFailureRate: number;
    verdict: string;
  };
}

interface ScaffoldArtifact {
  agent: string;
  filename: string;
  content: string;
  description: string;
}

interface ScaffoldResponse {
  artifacts: ScaffoldArtifact[];
  summary: string;
}

const SYSTEM_PROMPT = `You are an expert evaluation scaffold builder. Given probe results for a domain, generate the evaluation artifacts needed.

Generate exactly 5 artifacts from these agents:
1. Fixtures - Test fixture data (JSON format)
2. Environment - Environment configuration (YAML format)
3. Verifier - Verification script (Python format)
4. Instruction - Evaluation instructions (Markdown format)
5. Contamination - Contamination check data (JSONL format)

Return JSON:
{
  "artifacts": [
    {
      "agent": "Fixtures",
      "filename": "fixtures.json",
      "content": "The actual file content",
      "description": "What this artifact does"
    }
  ],
  "summary": "Brief summary of the scaffold"
}

Generate realistic, usable artifact content. Keep each artifact under 50 lines.`;

export async function POST(request: NextRequest) {
  try {
    const body: ScaffoldRequest = await request.json();

    const userPrompt = `Domain: ${body.domainLabel} (${body.domainId})
Target Model: ${body.targetModel}
Weakness Found: ${body.probeSummary.weaknessTitle}
Failure Rate: ${(body.probeSummary.aggregateFailureRate * 100).toFixed(1)}%
Verdict: ${body.probeSummary.verdict}

Generate scaffold artifacts to formalize this evaluation.`;

    const result = await generateJSON<ScaffoldResponse>(SYSTEM_PROMPT, userPrompt, {
      temperature: 0.4,
    });

    return Response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to generate scaffold';
    return Response.json({ error: message }, { status: 500 });
  }
}
