import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { title, description, totalSP } = await req.json();

  const stream = await client.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are a Tech Lead. Decompose this task into sub-tasks for a sprint.

Task: ${title}
Description: ${description ?? "Not provided"}
Total estimated SP: ${totalSP ?? 8}

Create 3-5 sub-tasks covering FE, BE, DB, Test layers as appropriate.
Respond with JSON array:
[
  {
    "type": "FE"|"BE"|"DB"|"Test",
    "name": "short name",
    "description": "1 sentence",
    "sp": <number>,
    "assignee": "TBD",
    "dependencies": []
  }
]

Respond ONLY with a valid JSON array, no markdown.`,
      },
    ],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
