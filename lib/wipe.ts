import { supabase } from "./supabase";

// Delete all rows from every table — used by both Jira import and seed routes.
export async function wipeAll() {
  await supabase.from("assignment_rationale").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("subtasks").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("sprint_health").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("tasks").delete().neq("id", "none");
  await supabase.from("sprints").delete().neq("id", "none");
  await supabase.from("team_members").delete().neq("id", "00000000-0000-0000-0000-000000000000");
}
