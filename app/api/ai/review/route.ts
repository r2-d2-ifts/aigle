import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { planned, done, spillover, blockers, sprintName } = await req.json();

  const stream = await client.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `Sen bir Scrum Master'sın. Aşağıdaki sprint metriklerine göre Türkçe bir sprint review metni yaz.

Sprint: ${sprintName ?? "Sprint 14"}
Planlanan SP: ${planned ?? 24}
Tamamlanan SP: ${done ?? 21}
Spillover: ${spillover ?? "13%"}, ${blockers ?? 3} task

Kısa, anlatılabilir, 3-4 cümle. Sadece metni yaz, başlık veya markdown ekleme.`,
      },
    ],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
