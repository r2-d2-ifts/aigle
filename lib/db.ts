import { supabase, isSupabaseConfigured } from "./supabase";
import * as mock from "./mockData";

// ── Sprints ──────────────────────────────────────────────────────────────────

export async function getSprints(): Promise<mock.Sprint[]> {
  if (!isSupabaseConfigured()) return mock.sprints;
  const { data } = await supabase
    .from("sprints")
    .select("id, name, start_date, end_date")
    .order("created_at", { ascending: true });
  if (!data?.length) return mock.sprints;
  return data.map((s) => ({ id: s.id, name: s.name, range: `${s.start_date ?? ""} – ${s.end_date ?? ""}` }));
}

export async function getVelocityTrend(): Promise<{ sprint: string; velocity: number }[]> {
  if (!isSupabaseConfigured()) return mock.velocityTrend;
  const { data } = await supabase
    .from("sprints")
    .select("name, velocity")
    .order("created_at", { ascending: true })
    .limit(5);
  if (!data?.length) return mock.velocityTrend;
  return data.map((s) => ({ sprint: s.name.replace("Sprint ", "S"), velocity: s.velocity ?? 0 }));
}

export async function getPlannedVsDone(): Promise<{ name: string; Planned: number; Done: number }[]> {
  if (!isSupabaseConfigured()) return mock.plannedVsDone;
  const { data } = await supabase.from("sprints").select("planned_sp, done_sp").order("created_at", { ascending: false }).limit(1);
  if (!data?.length) return mock.plannedVsDone;
  const s = data[0];
  return [
    { name: "Stories", Planned: Math.round(s.planned_sp * 0.67), Done: Math.round(s.done_sp * 0.67) },
    { name: "Bugs", Planned: Math.round(s.planned_sp * 0.21), Done: Math.round(s.done_sp * 0.24) },
    { name: "Tech Debt", Planned: Math.round(s.planned_sp * 0.12), Done: Math.round(s.done_sp * 0.1) },
  ];
}

// ── Tasks ─────────────────────────────────────────────────────────────────────

export async function getTasks(): Promise<mock.BacklogTask[]> {
  if (!isSupabaseConfigured()) return mock.backlog;
  const { data } = await supabase
    .from("tasks")
    .select("*")
    .eq("status", "backlog")
    .order("created_at", { ascending: true });
  if (!data?.length) return mock.backlog;
  return data.map((t) => ({
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

// ── Subtasks ──────────────────────────────────────────────────────────────────

export async function getSubtasks(taskId?: string): Promise<mock.Subtask[]> {
  if (!isSupabaseConfigured()) return mock.subtasks;
  let q = supabase.from("subtasks").select("*").order("created_at", { ascending: true });
  if (taskId) q = q.eq("task_id", taskId);
  const { data } = await q;
  if (!data?.length) return mock.subtasks;
  return data.map((s) => ({
    type: s.type as mock.Subtask["type"],
    name: s.name,
    sp: s.sp,
    assignee: s.assignee ?? "TBD",
  }));
}

export async function getAssignmentRationale(taskId?: string): Promise<typeof mock.assignmentRationale> {
  if (!isSupabaseConfigured()) return mock.assignmentRationale;
  const subtaskIds = taskId
    ? (await supabase.from("subtasks").select("id").eq("task_id", taskId)).data?.map((s) => s.id) ?? []
    : [];
  if (!subtaskIds.length) return mock.assignmentRationale;
  const { data } = await supabase.from("assignment_rationale").select("*").in("subtask_id", subtaskIds);
  if (!data?.length) return mock.assignmentRationale;
  return data.map((r) => ({ person: r.person, text: r.rationale_text }));
}

// ── Team ──────────────────────────────────────────────────────────────────────

export async function getTeamLoad(): Promise<{ name: string; load: number }[]> {
  if (!isSupabaseConfigured()) return mock.teamLoad;
  const { data } = await supabase.from("team_members").select("name, current_load").order("name");
  if (!data?.length) return mock.teamLoad;
  return data.map((m) => ({ name: m.name, load: m.current_load }));
}

// ── Health ────────────────────────────────────────────────────────────────────

export async function getHealthScore(): Promise<number> {
  if (!isSupabaseConfigured()) return mock.healthScore;
  const { data } = await supabase
    .from("sprint_health")
    .select("health_score")
    .order("created_at", { ascending: false })
    .limit(1);
  return data?.[0]?.health_score ?? mock.healthScore;
}

export async function getHealthFactors(): Promise<typeof mock.healthFactors> {
  if (!isSupabaseConfigured()) return mock.healthFactors;
  const { data } = await supabase
    .from("sprint_health")
    .select("velocity_score, spillover_score, blocker_score, overcommit_score")
    .order("created_at", { ascending: false })
    .limit(1);
  if (!data?.[0]) return mock.healthFactors;
  const h = data[0];
  return [
    { name: "Velocity", value: h.velocity_score, status: (h.velocity_score >= 75 ? "ok" : "warn") as "ok" | "warn" },
    { name: "Spillover", value: h.spillover_score, status: (h.spillover_score >= 75 ? "ok" : "warn") as "ok" | "warn" },
    { name: "Blockers", value: h.blocker_score, status: (h.blocker_score >= 75 ? "ok" : "warn") as "ok" | "warn" },
    { name: "Overcommit", value: h.overcommit_score, status: (h.overcommit_score >= 75 ? "ok" : "warn") as "ok" | "warn" },
  ];
}

// ── Upsert helpers (used by import + seed routes) ─────────────────────────────

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
  return supabase.from("team_members").upsert(rows, { onConflict: "name" });
}

export async function upsertSprintHealth(rows: object[]) {
  return supabase.from("sprint_health").upsert(rows);
}
