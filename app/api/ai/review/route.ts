import { NextRequest } from "next/server";
import Groq from "groq-sdk";

const client = new Groq();
const MODEL = "llama-3.3-70b-versatile";

export async function POST(req: NextRequest) {
  const { planned, done, spillover, blockers, sprintName } = await req.json();

  const stream = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 512,
    stream: true,
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
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) controller.enqueue(encoder.encode(delta));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
