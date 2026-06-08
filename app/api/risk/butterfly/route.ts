import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { blockedTask, sprintTasks } = await req.json();

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `You are a risk analyst. A task is blocked. Analyze downstream impact.

Blocked task: ${blockedTask}
Sprint tasks: ${JSON.stringify(sprintTasks ?? [])}

Respond with JSON:
{
  "impactChain": [
    {"level": 0, "status": "blocked", "label": "...", "detail": ""},
    {"level": 1, "status": "risk", "label": "...", "detail": "risk X%, +Y days"},
    {"level": 2, "status": "risk", "label": "...", "detail": "risk X%, +Y days"}
  ],
  "healthDelta": -17,
  "mitigation": "brief suggestion"
}

Only valid JSON, no markdown.`,
      },
    ],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "{}";
  const result = JSON.parse(text);
  return NextResponse.json(result);
}
