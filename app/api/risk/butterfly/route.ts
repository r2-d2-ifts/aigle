import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { impactChain } from "@/lib/mockData";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { blockedTask, sprintTasks } = await req.json();

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: `You are a risk analyst. A task is blocked. Analyze the downstream impact.

Blocked task: ${blockedTask}
Sprint tasks: ${JSON.stringify(sprintTasks ?? [])}

Respond with JSON:
{
  "impactChain": [
    {"level": 0, "status": "blocked", "label": "...", "detail": ""},
    {"level": 1, "status": "risk", "label": "...", "detail": "risk X%, +Y days"},
    ...
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
  } catch {
    return NextResponse.json({ impactChain, healthDelta: -17, mitigation: "Parallelize FE with mock API; unblock DB schema review by EOD." });
  }
}
