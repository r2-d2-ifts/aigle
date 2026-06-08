import { NextRequest, NextResponse } from "next/server";
import { buildCard, postToTeams, isTeamsConfigured } from "@/lib/teams";

export async function POST(req: NextRequest) {
  if (!isTeamsConfigured()) {
    return NextResponse.json({ error: "TEAMS_WEBHOOK_URL not configured" }, { status: 503 });
  }

  const { title, text, facts, color, actions } = await req.json();
  if (!title) return NextResponse.json({ error: "title required" }, { status: 400 });

  const card = buildCard({ title, text, facts, color, actions });
  const result = await postToTeams(card);
  return NextResponse.json(result, { status: result.ok ? 202 : 500 });
}
