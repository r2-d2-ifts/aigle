import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const MODEL = "llama-3.3-70b-versatile";

export async function POST(req: NextRequest) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({
      passes: true,
      confidence: 0,
      references: 0,
      rationale: "GROQ_API_KEY not configured. Add it to .env.local to enable AI sizing.",
    });
  }

  const { title, description, references } = await req.json();
  const client = new Groq();

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 512,
      response_format: { type: "json_object" },
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

    const text = completion.choices[0]?.message?.content ?? "{}";
    return NextResponse.json(JSON.parse(text));
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
