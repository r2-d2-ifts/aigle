import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { wipeAll } from "@/lib/wipe";
import { sprints, tasks, subtasks, teamMembers, sprintHealth } from "@/lib/seedData.mjs";

async function insertTeam() {
  let r = await supabase.from("team_members").insert(teamMembers);
  if (r.error && /email/i.test(r.error.message)) {
    const stripped = teamMembers.map(({ email: _e, ...rest }: Record<string, unknown>) => rest);
    r = await supabase.from("team_members").insert(stripped);
  }
  return r;
}

export async function POST() {
  await wipeAll();

  const errors: string[] = [];
  const log = (label: string, err: { message: string } | null) => {
    if (err) errors.push(`${label}: ${err.message}`);
  };

  log("sprints",  (await supabase.from("sprints").upsert(sprints, { onConflict: "id" })).error);
  log("tasks",    (await supabase.from("tasks").upsert(tasks, { onConflict: "id" })).error);
  log("subtasks", (await supabase.from("subtasks").insert(subtasks)).error);
  log("team",     (await insertTeam()).error);
  log("health",   (await supabase.from("sprint_health").upsert(sprintHealth)).error);

  return NextResponse.json({
    ok: errors.length === 0,
    seeded: {
      sprints: sprints.length,
      tasks: tasks.length,
      subtasks: subtasks.length,
      teamMembers: teamMembers.length,
      health: sprintHealth.length,
    },
    errors: errors.length ? errors : undefined,
  });
}
