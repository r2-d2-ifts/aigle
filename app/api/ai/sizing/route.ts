import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { title, description, rationale, references } = await req.json();

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: `You are a Scrum sizing expert. Analyze this Jira task and suggest story points.

Task: ${title}
Description: ${description ?? "Not provided"}

First, check if this task passes the quality gate:
- Is the problem clearly defined?
- Is the platform/module specified?
- Is the expected behavior described?
- Are acceptance criteria present?

If it fails, respond with JSON: {"passes": false, "rejectReason": "..."}

If it passes, respond with JSON:
{"passes": true, "aiSP": <number 1-13>, "confidence": <0-100>, "references": ${references ?? 5}, "rationale": "...brief Turkish explanation..."}

Respond ONLY with valid JSON, no markdown.`,
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "{}";
    const result = JSON.parse(text);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "AI unavailable" }, { status: 500 });
  }
}
