import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { getTeamLoad } from "@/lib/db";

const MODEL = "llama-3.3-70b-versatile";

const SYSTEM = `You are the Tech Lead AI for contextual smart assignment. Match sub-tasks to team members using skill fit + current load + past domain history. Every assignment must be explainable.`;

export async function POST(req: NextRequest) {
  const { subtasks } = await req.json();

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ subtasks, rationale: [] });
  }

  const team = await getTeamLoad();
  const client = new Groq();

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 768,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: `You are a Tech Lead assigning sub-tasks to team members.

Sub-tasks to assign:
${JSON.stringify(subtasks, null, 2)}

Team members (name, current sprint load %):
${JSON.stringify(team, null, 2)}

Rules:
- Match sub-task type to skills: FE→React/TypeScript, BE→backend, DB→database, Test→testing
- Prefer members with lower load
- Consider domain history if available

Respond with JSON: {"assignments": [{"assignee": "name", "rationale": "..."}]}
The assignments array must match sub-tasks order. ONLY valid JSON.`,
        },
      ],
    });

    const text = completion.choices[0]?.message?.content ?? '{"assignments":[]}';
    const parsed = JSON.parse(text);
    const assignments: { assignee: string; rationale: string }[] = parsed.assignments ?? [];

    const result = subtasks.map((s: { type: string; name: string }, i: number) => ({
      ...s,
      assignee: assignments[i]?.assignee ?? "TBD",
    }));

    const rationale = assignments.map((a, i) => ({
      person: a.assignee,
      text: `${subtasks[i]?.type}: ${a.rationale}`,
    }));

    return NextResponse.json({ subtasks: result, rationale });
  } catch (e) {
    return NextResponse.json({ error: String(e), subtasks, rationale: [] }, { status: 500 });
  }
}
