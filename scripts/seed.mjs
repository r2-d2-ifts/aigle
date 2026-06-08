import { createClient } from "@supabase/supabase-js";
import { sprints, tasks, subtasks, teamMembers, sprintHealth } from "../lib/seedData.mjs";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) { console.error("Missing Supabase env vars"); process.exit(1); }

const sb = createClient(url, key, { auth: { persistSession: false } });

async function clear() {
  console.log("Clearing…");
  await sb.from("assignment_rationale").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await sb.from("subtasks").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await sb.from("sprint_health").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await sb.from("tasks").delete().neq("id", "none");
  await sb.from("sprints").delete().neq("id", "none");
  await sb.from("team_members").delete().neq("id", "00000000-0000-0000-0000-000000000000");
}

async function insertTeam() {
  let r = await sb.from("team_members").insert(teamMembers);
  if (r.error && /email/i.test(r.error.message)) {
    console.warn("⚠ team_members.email column missing — inserting without email");
    console.warn("   Run: alter table team_members add column if not exists email text;");
    const stripped = teamMembers.map(({ email: _e, ...rest }) => rest);
    r = await sb.from("team_members").insert(stripped);
  }
  return r;
}

async function run() {
  await clear();

  const log = (label, r, n) =>
    console.log(`  ${label}: ${r.error ? "ERROR: " + r.error.message : "✓ " + n}`);

  log("sprints",  await sb.from("sprints").upsert(sprints, { onConflict: "id" }),    sprints.length);
  log("tasks",    await sb.from("tasks").upsert(tasks, { onConflict: "id" }),        tasks.length);
  log("subtasks", await sb.from("subtasks").insert(subtasks),                        subtasks.length);
  log("team",     await insertTeam(),                                                teamMembers.length);
  log("health",   await sb.from("sprint_health").upsert(sprintHealth),               sprintHealth.length);

  console.log("\nDone.");
  console.log(`  ${sprints.length} sprints | ${tasks.length} tasks (${tasks.filter(t=>!t.passes).length} fail gate) | ${subtasks.length} subtasks | ${teamMembers.length} team | ${sprintHealth.length} health`);
}

run().catch((e) => { console.error(e); process.exit(1); });
