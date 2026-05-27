/* Probe API Route - Generates probe variants for a domain */

import { NextRequest } from 'next/server';
import { generateJSON } from '@/lib/gemini';

interface ProbeRequest {
  domainId: string;
  domainLabel: string;
  targetModel: string;
  projectName: string;
  workflow: string;
  hypothesis: string;
}

interface ProbeVariantResult {
  name: string;
  description: string;
  testCases: Array<{
    input: string;
    expectedBehavior: string;
    failureType: string;
  }>;
  estimatedFailureRate: number;
}

interface ProbeResponse {
  variants: ProbeVariantResult[];
  weaknessTitle: string;
  aggregateFailureRate: number;
  verdict: 'promote' | 'redesign' | 'reject';
  summary: string;
}

const SYSTEM_PROMPT = `You are an expert AI evaluation probe designer. Given a domain and model context, generate 5 probe variants that test for specific weaknesses.

Each variant should be a different testing strategy:
1. Plain - Direct straightforward test
2. Prior Work - Test with context from prior similar work  
3. Schema Hint - Test with structured output expectations
4. Audit Trail - Test with chain-of-thought reasoning requirements
5. Speed Run - Test under time/token pressure

Return JSON:
{
  "weaknessTitle": "Brief title of the weakness being probed",
  "variants": [
    {
      "name": "Plain",
      "description": "What this variant tests",
      "testCases": [
        {
          "input": "The actual test prompt to send to the model",
          "expectedBehavior": "What a correct response looks like",
          "failureType": "What failure mode this catches"
        }
      ],
      "estimatedFailureRate": 0.45
    }
  ],
  "aggregateFailureRate": 0.38,
  "verdict": "promote",
  "summary": "1-2 sentence summary of findings"
}

The verdict should be:
- "promote" if aggregateFailureRate > 0.25 (weakness confirmed, worth scaffolding)
- "redesign" if between 0.1 and 0.25 (marginal, needs refinement)
- "reject" if < 0.1 (model handles this well)

Generate realistic, specific test cases that would actually reveal model weaknesses. Each variant should have 2-3 test cases.`;

export async function POST(request: NextRequest) {
  try {
    const body: ProbeRequest = await request.json();

    const userPrompt = `Domain: ${body.domainLabel} (${body.domainId})
Target Model: ${body.targetModel}
Project: ${body.projectName}
Workflow Context: ${body.workflow || 'General model evaluation'}
Hypothesis: ${body.hypothesis || 'Testing for general weaknesses in this domain'}

Generate probe variants that specifically test ${body.domainLabel} weaknesses in ${body.targetModel}.`;

    const result = await generateJSON<ProbeResponse>(SYSTEM_PROMPT, userPrompt, {
      temperature: 0.6,
    });

    return Response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to generate probes';
    return Response.json({ error: message }, { status: 500 });
  }
}
