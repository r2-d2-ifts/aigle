import { NextResponse } from "next/server";
import { getBacklog, isConfigured } from "@/lib/jiraClient";
import { upsertTasks } from "@/lib/db";
import { getTasks } from "@/lib/db";

export async function GET() {
  const data = await getTasks();
  return NextResponse.json({ source: "supabase", data });
}

export async function POST() {
  if (!isConfigured()) {
    return NextResponse.json({ error: "Jira not configured" }, { status: 400 });
  }
  try {
    const items = await getBacklog();
    const rows = items.map((t: Record<string, unknown>) => {
      const fields = t.fields as Record<string, unknown>;
      return {
        id: String(t.id),
        jira_id: String(t.id),
        title: (fields?.summary as string) ?? "Untitled",
        description: (fields?.description as string) ?? null,
        type: ((fields?.issuetype as Record<string, unknown>)?.name as string)?.toLowerCase() === "bug" ? "bug" : "story",
        current_sp: (fields?.story_points as number) ?? null,
        status: "backlog",
      };
    });
    await upsertTasks(rows);
    return NextResponse.json({ synced: rows.length });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
