import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const MODEL = "llama-3.3-70b-versatile";

const SYSTEM = `You are a Scrum Master writing structured sprint reviews in Turkish. Always produce three distinct sections with emoji headers.`;

export async function POST(req: NextRequest) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "GROQ_API_KEY not configured." }, { status: 503 });
  }

  const { planned, done, spillover, blockers, sprintName } = await req.json();
  const client = new Groq();

  const stream = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 768,
    stream: true,
    messages: [
      { role: "system", content: SYSTEM },
      {
        role: "user",
        content: `${sprintName ?? "Sprint 14"} için sprint review yaz.

Metrikler:
- Planlanan: ${planned ?? 24} SP
- Tamamlanan: ${done ?? 21} SP
- Spillover: ${spillover ?? "13%"}, ${blockers ?? 3} task

Tam olarak şu 3 bölümlü yapıyı kullan:

✅ **Tamamlananlar**
[Bu sprintte başarılan işler, 1-2 cümle]

⚠️ **Planlanan vs Gerçekleşen**
[Sapmalar ve sayısal karşılaştırma, 1-2 cümle]

🚧 **Taşan İşler ve Nedenleri**
[Spillover sebepleri ve etkileri, 1-2 cümle]

Sadece bu 3 bölüm. Markdown başlık + tek satır boşluk. Başka açıklama yok.`,
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
