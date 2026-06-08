import { supabase } from "./supabase";
import type { BacklogTask, Subtask, Sprint } from "./types";

// ── Sprints ───────────────────────────────────────────────────────────────────

export async function getSprints(): Promise<Sprint[]> {
  const { data } = await supabase
    .from("sprints")
    .select("id, name, start_date, end_date")
    .order("created_at", { ascending: true });
  return (data ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    range: `${s.start_date ?? ""} – ${s.end_date ?? ""}`,
  }));
}

export async function getVelocityTrend(): Promise<{ sprint: string; velocity: number }[]> {
  const { data } = await supabase
    .from("sprints")
    .select("name, velocity")
    .order("created_at", { ascending: true })
    .limit(5);
  return (data ?? []).map((s) => ({
    sprint: s.name.replace("Sprint ", "S"),
    velocity: s.velocity ?? 0,
  }));
}

export async function getPlannedVsDone(): Promise<{ name: string; Planned: number; Done: number }[]> {
  const { data } = await supabase
    .from("sprints")
    .select("planned_sp, done_sp")
    .order("created_at", { ascending: false })
    .limit(1);
  if (!data?.length) return [];
  const s = data[0];
  return [
    { name: "Stories", Planned: Math.round(s.planned_sp * 0.67), Done: Math.round(s.done_sp * 0.67) },
    { name: "Bugs", Planned: Math.round(s.planned_sp * 0.21), Done: Math.round(s.done_sp * 0.24) },
    { name: "Tech Debt", Planned: Math.round(s.planned_sp * 0.12), Done: Math.round(s.done_sp * 0.1) },
  ];
}

// ── Tasks ─────────────────────────────────────────────────────────────────────

export async function getTasks(): Promise<BacklogTask[]> {
  const { data } = await supabase
    .from("tasks")
    .select("*")
    .eq("status", "backlog")
    .order("created_at", { ascending: true });
  return (data ?? []).map((t) => ({
    id: t.id,
    title: t.title,
    type: t.type as "story" | "bug",
    currentSP: t.current_sp,
    aiSP: t.ai_sp ?? 0,
    confidence: t.confidence ?? 0,
    references: t.references_count ?? 0,
    rationale: t.rationale ?? "",
    passes: t.passes ?? true,
    rejectReason: t.reject_reason ?? undefined,
  }));
}

export async function getBlockableTasks(): Promise<{ id: string; name: string }[]> {
  const { data } = await supabase
    .from("tasks")
    .select("id, title")
    .neq("status", "done")
    .order("created_at", { ascending: true })
    .limit(10);
  return (data ?? []).map((t) => ({ id: t.id, name: t.title }));
}

// ── Subtasks ──────────────────────────────────────────────────────────────────

export async function getSubtasks(taskId?: string): Promise<Subtask[]> {
  let q = supabase.from("subtasks").select("*").order("created_at", { ascending: true });
  if (taskId) q = q.eq("task_id", taskId);
  const { data } = await q;
  return (data ?? []).map((s) => ({
    type: s.type as Subtask["type"],
    name: s.name,
    sp: s.sp,
    assignee: s.assignee ?? "TBD",
  }));
}

export async function getAssignmentRationale(
  taskId?: string
): Promise<{ person: string; text: string }[]> {
  if (!taskId) return [];
  const { data: subtaskRows } = await supabase
    .from("subtasks")
    .select("id")
    .eq("task_id", taskId);
  const ids = (subtaskRows ?? []).map((s) => s.id);
  if (!ids.length) return [];
  const { data } = await supabase
    .from("assignment_rationale")
    .select("*")
    .in("subtask_id", ids);
  return (data ?? []).map((r) => ({ person: r.person, text: r.rationale_text }));
}

// ── Team ──────────────────────────────────────────────────────────────────────

export async function getTeamLoad(): Promise<{ name: string; load: number }[]> {
  const { data } = await supabase
    .from("team_members")
    .select("name, current_load")
    .order("name");
  return (data ?? []).map((m) => ({ name: m.name, load: m.current_load }));
}

// ── Health ────────────────────────────────────────────────────────────────────

export async function getHealthScore(): Promise<number> {
  const { data } = await supabase
    .from("sprint_health")
    .select("health_score")
    .order("created_at", { ascending: false })
    .limit(1);
  return data?.[0]?.health_score ?? 0;
}

export async function getHealthFactors(): Promise<
  { name: string; value: number; status: "ok" | "warn" }[]
> {
  const { data } = await supabase
    .from("sprint_health")
    .select("velocity_score, spillover_score, blocker_score, overcommit_score")
    .order("created_at", { ascending: false })
    .limit(1);
  if (!data?.[0]) return [];
  const h = data[0];
  return [
    { name: "Velocity", value: h.velocity_score, status: h.velocity_score >= 75 ? "ok" : "warn" },
    { name: "Spillover", value: h.spillover_score, status: h.spillover_score >= 75 ? "ok" : "warn" },
    { name: "Blockers", value: h.blocker_score, status: h.blocker_score >= 75 ? "ok" : "warn" },
    { name: "Overcommit", value: h.overcommit_score, status: h.overcommit_score >= 75 ? "ok" : "warn" },
  ];
}

// ── Upsert helpers ────────────────────────────────────────────────────────────

export async function upsertSprints(rows: object[]) {
  return supabase.from("sprints").upsert(rows, { onConflict: "id" });
}

export async function upsertTasks(rows: object[]) {
  return supabase.from("tasks").upsert(rows, { onConflict: "id" });
}

export async function insertSubtasks(rows: object[]) {
  return supabase.from("subtasks").insert(rows);
}

export async function upsertTeamMembers(rows: object[]) {
  return supabase.from("team_members").insert(rows);
}

export async function upsertSprintHealth(rows: object[]) {
  return supabase.from("sprint_health").upsert(rows);
}
