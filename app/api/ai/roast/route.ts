import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { planned, done, spillover, sprintName } = await req.json();

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    messages: [
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

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  return NextResponse.json({ text });
}
