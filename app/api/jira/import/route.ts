import { NextResponse } from "next/server";
import { getBacklog, getSprints, getVelocity, isConfigured } from "@/lib/jiraClient";
import { upsertSprints, upsertTasks } from "@/lib/db";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function POST() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured — add credentials to .env.local" }, { status: 400 });
  }
  if (!isConfigured()) {
    return NextResponse.json({ error: "Jira not configured — check JIRA_* env vars" }, { status: 400 });
  }

  const errors: string[] = [];
  let sprintCount = 0;
  let taskCount = 0;

  try {
    const [jiraSprints, jiraBacklog] = await Promise.all([
      getSprints().catch(() => []),
      getBacklog().catch(() => []),
    ]);

    if (jiraSprints.length) {
      const rows = jiraSprints.map((s: Record<string, unknown>) => ({
        id: String(s.id),
        name: (s.fields as Record<string, unknown>)?.summary ?? `Sprint ${s.id}`,
        jira_id: String(s.id),
        status: "active",
      }));
      const { error } = await upsertSprints(rows);
      if (error) errors.push(`Sprints: ${error.message}`);
      else sprintCount = rows.length;
    }

    if (jiraBacklog.length) {
      const rows = jiraBacklog.map((t: Record<string, unknown>) => {
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
      const { error } = await upsertTasks(rows);
      if (error) errors.push(`Tasks: ${error.message}`);
      else taskCount = rows.length;
    }
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    imported: { sprints: sprintCount, tasks: taskCount },
    errors: errors.length ? errors : undefined,
  });
}
