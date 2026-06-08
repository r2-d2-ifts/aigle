import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getTeamLoad } from "@/lib/db";
import { assignmentRationale as mockRationale, teamLoad as mockTeam } from "@/lib/mockData";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { subtasks } = await req.json();

  const team = await getTeamLoad().catch(() => mockTeam);

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 768,
      messages: [
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

Respond with JSON array matching sub-tasks order:
[
  {
    "assignee": "name",
    "rationale": "brief reason: skill match + load + history"
  }
]

ONLY valid JSON array, no markdown.`,
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "[]";
    const assignments: { assignee: string; rationale: string }[] = JSON.parse(text);

    // Merge assignments back into subtasks
    const result = subtasks.map((s: { type: string; name: string }, i: number) => ({
      ...s,
      assignee: assignments[i]?.assignee ?? "TBD",
    }));

    const rationale = assignments.map((a, i) => ({
      person: a.assignee,
      text: `${subtasks[i]?.type}: ${a.rationale}`,
    }));

    return NextResponse.json({ subtasks: result, rationale });
  } catch {
    // Fall back: distribute by type
    const typeMap: Record<string, string> = { FE: "Ayşe", BE: "Mehmet", DB: "Mehmet", Test: "Can" };
    const result = subtasks.map((s: { type: string }) => ({ ...s, assignee: typeMap[s.type] ?? "TBD" }));
    return NextResponse.json({ subtasks: result, rationale: mockRationale });
  }
}
