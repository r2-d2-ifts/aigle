import { NextResponse } from "next/server";
import { upsertSprints, upsertTasks, insertSubtasks, upsertTeamMembers, upsertSprintHealth } from "@/lib/db";
import { isSupabaseConfigured } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import * as mock from "@/lib/mockData";

export async function POST() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured — add credentials to .env.local" }, { status: 400 });
  }

  // Clear existing data first
  await supabase.from("assignment_rationale").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("subtasks").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("sprint_health").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("tasks").delete().neq("id", "none");
  await supabase.from("sprints").delete().neq("id", "none");
  await supabase.from("team_members").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  const errors: string[] = [];

  // Sprints
  const sprintRows = mock.sprints.map((s, i) => ({
    id: s.id,
    name: s.name,
    start_date: s.range.split("–")[0]?.trim(),
    end_date: s.range.split("–")[1]?.trim(),
    status: i === mock.sprints.length - 1 ? "active" : "closed",
    velocity: mock.velocityTrend[i]?.velocity ?? 0,
    planned_sp: 24,
    done_sp: 21,
  }));
  const { error: se } = await upsertSprints(sprintRows);
  if (se) errors.push(`Sprints: ${se.message}`);

  // Backlog tasks
  const taskRows = mock.backlog.map((t) => ({
    id: t.id,
    title: t.title,
    type: t.type,
    current_sp: t.currentSP,
    ai_sp: t.aiSP,
    confidence: t.confidence,
    references_count: t.references,
    rationale: t.rationale,
    passes: t.passes,
    reject_reason: t.rejectReason ?? null,
    sprint_id: null,
    status: "backlog",
  }));
  const { error: te } = await upsertTasks(taskRows);
  if (te) errors.push(`Tasks: ${te.message}`);

  // Sub-tasks (linked to t4 — Implement Payment Flow)
  const subtaskRows = mock.subtasks.map((s) => ({
    task_id: "t4",
    type: s.type,
    name: s.name,
    sp: s.sp,
    assignee: s.assignee,
    dependencies: [],
  }));
  const { error: ste } = await insertSubtasks(subtaskRows);
  if (ste) errors.push(`Subtasks: ${ste.message}`);

  // Team members
  const teamRows = [
    { name: "Ayşe", skills: ["React", "TypeScript", "CSS"], current_load: 40, domain_history: [{ domain: "FE", sprints: 3 }] },
    { name: "Mehmet", skills: ["FastAPI", "Python", "PostgreSQL"], current_load: 55, domain_history: [{ domain: "BE", sprints: 4 }, { domain: "DB", sprints: 2 }] },
    { name: "Can", skills: ["Playwright", "Jest", "QA"], current_load: 30, domain_history: [{ domain: "Test", sprints: 5 }] },
  ];
  const { error: me } = await upsertTeamMembers(teamRows);
  if (me) errors.push(`TeamMembers: ${me.message}`);

  // Sprint health (for latest sprint s14)
  const healthRows = [{
    sprint_id: "s14",
    velocity_score: 95,
    spillover_score: 60,
    blocker_score: 80,
    overcommit_score: 80,
    health_score: mock.healthScore,
    spillover_rate: 13.0,
    cycle_time_days: 2.3,
    blocked_count: 2,
  }];
  const { error: he } = await upsertSprintHealth(healthRows);
  if (he) errors.push(`SprintHealth: ${he.message}`);

  return NextResponse.json({
    ok: errors.length === 0,
    seeded: {
      sprints: sprintRows.length,
      tasks: taskRows.length,
      subtasks: subtaskRows.length,
      teamMembers: teamRows.length,
      healthSnapshots: healthRows.length,
    },
    errors: errors.length ? errors : undefined,
  });
}
