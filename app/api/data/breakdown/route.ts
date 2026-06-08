import { NextRequest, NextResponse } from "next/server";
import { getSubtasks, getAssignmentRationale, getTeamLoad } from "@/lib/db";

export async function GET(req: NextRequest) {
  const taskId = req.nextUrl.searchParams.get("taskId") ?? undefined;
  const [subtasks, assignmentRationale, teamLoad] = await Promise.all([
    getSubtasks(taskId),
    getAssignmentRationale(taskId),
    getTeamLoad(),
  ]);
  return NextResponse.json({ subtasks, assignmentRationale, teamLoad });
}
