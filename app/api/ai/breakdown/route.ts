import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const MODEL = "llama-3.3-70b-versatile";

const SYSTEM = `You are the Tech Lead AI — a senior engineer who decomposes tasks into typed technical sub-tasks (FE, BE, DB, Test). Each sub-task is independently shippable.`;

export async function POST(req: NextRequest) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ subtasks: [] });
  }

  const { title, description, totalSP } = await req.json();
  const client = new Groq();

  const stream = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 1024,
    stream: true,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM },
      {
        role: "user",
        content: `You are a Tech Lead. Decompose this task into sub-tasks for a sprint.

Task: ${title}
Description: ${description ?? "Not provided"}
Total estimated SP: ${totalSP ?? 8}

Create 3-5 sub-tasks covering FE, BE, DB, Test layers as appropriate.
Respond with JSON object: { "subtasks": [...] } where each subtask has:
  type: "FE"|"BE"|"DB"|"Test"
  name: short name
  description: 1 sentence
  sp: number
  assignee: "TBD"
  dependencies: []

ONLY valid JSON, no markdown.`,
      },
    ],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      let buffer = "";
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) {
          buffer += delta;
          controller.enqueue(encoder.encode(delta));
        }
      }
      // Reshape if model wrapped in {subtasks: [...]} — caller expects bare array
      try {
        const parsed = JSON.parse(buffer);
        if (parsed.subtasks && Array.isArray(parsed.subtasks)) {
          // No reshape mid-stream — client must parse and unwrap. Send marker.
        }
      } catch {}
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
