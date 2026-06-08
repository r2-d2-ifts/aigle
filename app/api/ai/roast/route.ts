import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const MODEL = "llama-3.3-70b-versatile";

const SYSTEM = `You are the Scrum Master AI in roast mode — sarcastic but fair, data-driven, never insulting individuals. Output is Turkish, max 3 sentences, includes one actionable suggestion.`;

export async function POST(req: NextRequest) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "GROQ_API_KEY not configured.", text: "" }, { status: 503 });
  }

  const { planned, done, spillover, sprintName } = await req.json();
  const client = new Groq();

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 256,
      messages: [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: `Sen alaycı ama adil bir Scrum koçusun. Bu sprint metriklerini Türkçe, esprili ama hakaret içermeyen bir şekilde eleştir.

Sprint: ${sprintName ?? "Sprint 14"}
Planlanan: ${planned ?? 24} SP, Tamamlanan: ${done ?? 21} SP
Spillover: ${spillover ?? "13%"}

2-3 cümle max. Veriye dayalı, mizahi, aksiyon öneren. Sadece metni yaz.`,
        },
      ],
    });

    const text = completion.choices[0]?.message?.content ?? "";
    return NextResponse.json({ text });
  } catch (e) {
    return NextResponse.json({ error: String(e), text: "" }, { status: 500 });
  }
}
