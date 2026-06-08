import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const client = new Groq();
const MODEL = "llama-3.3-70b-versatile";

const SYSTEM = `You are an Agile risk analyst. Your role is to predict why a task might get blocked based on patterns from past sprints. Be specific, actionable, and confident with percentages.`;

export async function POST(req: NextRequest) {
  const { title, description, type } = await req.json();

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 512,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: `Analyze blocker risk for this task using past sprint patterns.

Task: ${title}
Type: ${type ?? "story"}
Description: ${description ?? "Not provided"}

Common past blocker causes:
- Backend dependency delays (DB schema not ready, API not deployed)
- External team coordination (3rd party APIs, security review)
- Unclear requirements (acceptance criteria, design specs)
- Tech debt friction (legacy code, flaky tests)
- Infrastructure (env config, secrets, deployment)

Respond with JSON:
{
  "riskPct": <0-100>,
  "topCauses": [
    {"cause": "...", "probability": <0-100>, "reasoning": "brief Turkish explanation"}
  ],
  "mitigations": ["short Turkish action 1", "short Turkish action 2"]
}

Return 2-3 top causes. ONLY valid JSON.`,
        },
      ],
    });

    const text = completion.choices[0]?.message?.content ?? "{}";
    return NextResponse.json(JSON.parse(text));
  } catch (e) {
    return NextResponse.json({ error: String(e), riskPct: 0, topCauses: [], mitigations: [] }, { status: 500 });
  }
}
