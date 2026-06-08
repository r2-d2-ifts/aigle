import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const MODEL = "llama-3.3-70b-versatile";

export async function POST(req: NextRequest) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ impactChain: [], healthDelta: 0, mitigation: "GROQ_API_KEY not configured." });
  }

  const { blockedTask, sprintTasks } = await req.json();
  const client = new Groq();

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 512,
      response_format: { type: "json_object" },
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

ONLY valid JSON, no markdown.`,
        },
      ],
    });

    const text = completion.choices[0]?.message?.content ?? "{}";
    return NextResponse.json(JSON.parse(text));
  } catch (e) {
    return NextResponse.json({ error: String(e), impactChain: [], healthDelta: 0, mitigation: "" }, { status: 500 });
  }
}
