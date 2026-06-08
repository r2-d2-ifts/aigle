import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { taskId } = await req.json();
  if (!taskId) return NextResponse.json({ error: "taskId required" }, { status: 400 });

  // Find active sprint
  const { data: active } = await supabase
    .from("sprints")
    .select("id")
    .eq("status", "active")
    .limit(1)
    .single();

  if (!active) return NextResponse.json({ error: "No active sprint found" }, { status: 404 });

  const { error } = await supabase
    .from("tasks")
    .update({ sprint_id: active.id, status: "in_progress" })
    .eq("id", taskId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, sprintId: active.id });
}
