import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

// ── Data ──────────────────────────────────────────────────────────────────────

const sprints = [
  { id: "s10", name: "Sprint 10", start_date: "Mar 3", end_date: "Mar 14", status: "closed", velocity: 34, planned_sp: 34, done_sp: 34 },
  { id: "s11", name: "Sprint 11", start_date: "Mar 17", end_date: "Mar 28", status: "closed", velocity: 38, planned_sp: 40, done_sp: 38 },
  { id: "s12", name: "Sprint 12", start_date: "Mar 31", end_date: "Apr 11", status: "closed", velocity: 40, planned_sp: 38, done_sp: 40 },
  { id: "s13", name: "Sprint 13", start_date: "Apr 14", end_date: "Apr 25", status: "closed", velocity: 34, planned_sp: 36, done_sp: 34 },
  { id: "s14", name: "Sprint 14", start_date: "Apr 28", end_date: "May 9",  status: "active", velocity: 42, planned_sp: 24, done_sp: 21 },
];

const tasks = [
  { id: "t1", title: "Login page broken on Safari", type: "bug", current_sp: null, ai_sp: 5, confidence: 82, references_count: 8, rationale: "Benzer geçmiş tasklar ortalama 4.8 SP sürmüş. Safari özel davranışı önceki sprintlerde de gözlemlendi.", passes: true, reject_reason: null, sprint_id: null, status: "backlog" },
  { id: "t2", title: "Add OAuth provider integration", type: "story", current_sp: null, ai_sp: 13, confidence: 41, references_count: 2, rationale: "Acceptance criteria eksik, geçmiş referans az.", passes: false, reject_reason: "No acceptance criteria. Add at least 3 testable conditions before sizing.", sprint_id: null, status: "backlog" },
  { id: "t3", title: "Dashboard refactor — modular widgets", type: "story", current_sp: null, ai_sp: 8, confidence: 76, references_count: 5, rationale: "Component split daha önce yapıldı (S12). UI değişikliği görece düşük riskli.", passes: true, reject_reason: null, sprint_id: null, status: "backlog" },
  { id: "t4", title: "Implement Payment Flow", type: "story", current_sp: null, ai_sp: 8, confidence: 88, references_count: 11, rationale: "Önceki ödeme entegrasyonu 7 SP sürmüştü, ek 1 SP regresyon testi için.", passes: true, reject_reason: null, sprint_id: "s14", status: "in_progress" },
  { id: "t5", title: "Email notification spam loop", type: "bug", current_sp: null, ai_sp: 3, confidence: 90, references_count: 4, rationale: "Kök neden büyük olasılıkla cron + retry. Geçen sprintteki benzer hata 2 SP.", passes: true, reject_reason: null, sprint_id: null, status: "backlog" },
];

const teamMembers = [
  { name: "Ayşe", skills: ["React", "TypeScript", "CSS"], current_load: 40, domain_history: [{ domain: "FE", sprints: 3 }] },
  { name: "Mehmet", skills: ["FastAPI", "Python", "PostgreSQL"], current_load: 55, domain_history: [{ domain: "BE", sprints: 4 }, { domain: "DB", sprints: 2 }] },
  { name: "Can", skills: ["Playwright", "Jest", "QA"], current_load: 30, domain_history: [{ domain: "Test", sprints: 5 }] },
];

const sprintHealth = [{
  sprint_id: "s14",
  velocity_score: 95,
  spillover_score: 60,
  blocker_score: 80,
  overcommit_score: 80,
  health_score: 78,
  spillover_rate: 13.0,
  cycle_time_days: 2.3,
  blocked_count: 2,
}];

// ── Seed ──────────────────────────────────────────────────────────────────────

async function clear() {
  console.log("Clearing existing data…");
  await supabase.from("assignment_rationale").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("subtasks").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("sprint_health").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("tasks").delete().neq("id", "none");
  await supabase.from("sprints").delete().neq("id", "none");
  await supabase.from("team_members").delete().neq("id", "00000000-0000-0000-0000-000000000000");
}

async function seed() {
  await clear();

  const results = {};

  let r = await supabase.from("sprints").upsert(sprints, { onConflict: "id" });
  results.sprints = r.error ? `ERROR: ${r.error.message}` : `✓ ${sprints.length}`;

  r = await supabase.from("tasks").upsert(tasks, { onConflict: "id" });
  results.tasks = r.error ? `ERROR: ${r.error.message}` : `✓ ${tasks.length}`;

  const subtaskRows = [
    { task_id: "t4", type: "FE", name: "Payment UI form", sp: 2, assignee: "Ayşe", dependencies: [] },
    { task_id: "t4", type: "BE", name: "Payment API", sp: 3, assignee: "Mehmet", dependencies: [] },
    { task_id: "t4", type: "DB", name: "Transactions table", sp: 1, assignee: "Mehmet", dependencies: [] },
    { task_id: "t4", type: "Test", name: "E2E payment flow", sp: 2, assignee: "Can", dependencies: [] },
  ];
  r = await supabase.from("subtasks").insert(subtaskRows);
  results.subtasks = r.error ? `ERROR: ${r.error.message}` : `✓ ${subtaskRows.length}`;

  r = await supabase.from("team_members").insert(teamMembers);
  results.teamMembers = r.error ? `ERROR: ${r.error.message}` : `✓ ${teamMembers.length}`;

  r = await supabase.from("sprint_health").upsert(sprintHealth);
  results.sprintHealth = r.error ? `ERROR: ${r.error.message}` : `✓ ${sprintHealth.length}`;

  console.log("\nSeed results:");
  for (const [k, v] of Object.entries(results)) console.log(`  ${k}: ${v}`);
}

seed().catch(console.error);
