/* Chat API Route - Streaming responses from Gemini */

import { NextRequest } from 'next/server';
import { streamText } from '@/lib/gemini';

const SYSTEM_PROMPT = `You are Harbor Eval, an expert AI evaluation assistant. You help users create robust model evaluations that probe weaknesses in large language models.

Your role:
- Guide users through the evaluation creation process
- Explain probe results, scaffold artifacts, and validation outcomes
- Suggest next steps based on domain analysis
- Be concise, technical, and helpful

When the user asks about a domain (like "instruction following" or "safety"), provide specific, actionable evaluation strategies.

Format responses in clean markdown. Use bullet points for lists. Keep responses under 300 words unless asked for detail.`;

export async function POST(request: NextRequest) {
  try {
    const { messages, context } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: 'messages array required' }, { status: 400 });
    }

    // Build conversation history as a single prompt
    const conversation = messages
      .map((m: { role: string; content: string }) => {
        const prefix = m.role === 'user' ? 'User' : m.role === 'assistant' ? 'Assistant' : 'System';
        return `${prefix}: ${m.content}`;
      })
      .join('\n\n');

    const contextStr = context
      ? `\n\nCurrent context:\n- Project: ${context.projectName || 'Unknown'}\n- Target model: ${context.targetModel || 'Unknown'}\n- Current domain: ${context.focusedDomain || 'None'}\n- Global state: ${context.globalState || 'idle'}`
      : '';

    const fullPrompt = conversation + contextStr;

    // Stream the response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamText(SYSTEM_PROMPT, fullPrompt)) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : 'Stream error';
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: errorMsg })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return Response.json({ error: message }, { status: 500 });
  }
}
