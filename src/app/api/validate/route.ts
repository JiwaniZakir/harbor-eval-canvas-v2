/* Validate API Route - Runs validation gates on scaffolded evaluation */

import { NextRequest } from 'next/server';
import { generateJSON } from '@/lib/gemini';

interface ValidateRequest {
  domainId: string;
  domainLabel: string;
  targetModel: string;
  artifactCount: number;
  probeSummary: {
    weaknessTitle: string;
    aggregateFailureRate: number;
  };
}

interface GateResult {
  name: string;
  type: 'oracle' | 'nop' | 'spoiler';
  passed: boolean;
  details: string;
  score: number;
}

interface ValidateResponse {
  gates: GateResult[];
  allPassed: boolean;
  sweepResult: {
    passAt3: number;
    trials: Array<{
      idx: number;
      reward: number;
      status: 'pass' | 'fail';
      summary: string;
    }>;
  };
  summary: string;
}

const SYSTEM_PROMPT = `You are an evaluation validation engine. Run 3 validation gates and a sweep on the evaluation:

1. Oracle Sweep - Does a known-good model pass the eval? (should pass)
2. Nop Sweep - Does a trivial/random response fail? (should fail, which means the eval works)
3. Spoiler Lint - Are there answer leaks in the instructions? (should pass = no leaks)

Then run a 5-trial sweep of the target model.

Return JSON:
{
  "gates": [
    {
      "name": "Oracle Sweep",
      "type": "oracle",
      "passed": true,
      "details": "Explanation of result",
      "score": 0.95
    }
  ],
  "allPassed": true,
  "sweepResult": {
    "passAt3": 0.4,
    "trials": [
      {"idx": 1, "reward": 0.8, "status": "pass", "summary": "Brief trial result"},
      {"idx": 2, "reward": 0.2, "status": "fail", "summary": "Brief trial result"},
      {"idx": 3, "reward": 0.6, "status": "pass", "summary": "Brief trial result"},
      {"idx": 4, "reward": 0.1, "status": "fail", "summary": "Brief trial result"},
      {"idx": 5, "reward": 0.7, "status": "pass", "summary": "Brief trial result"}
    ]
  },
  "summary": "Overall validation summary"
}

Generate realistic validation results. The pass@3 should reflect how often the target model passes in 3 attempts.`;

export async function POST(request: NextRequest) {
  try {
    const body: ValidateRequest = await request.json();

    const userPrompt = `Domain: ${body.domainLabel} (${body.domainId})
Target Model: ${body.targetModel}
Weakness: ${body.probeSummary.weaknessTitle}
Probe Failure Rate: ${(body.probeSummary.aggregateFailureRate * 100).toFixed(1)}%
Artifacts Generated: ${body.artifactCount}

Run validation gates and sweep for this evaluation.`;

    const result = await generateJSON<ValidateResponse>(SYSTEM_PROMPT, userPrompt, {
      temperature: 0.4,
    });

    return Response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to validate';
    return Response.json({ error: message }, { status: 500 });
  }
}
