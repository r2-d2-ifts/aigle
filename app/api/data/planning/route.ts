import { NextResponse } from "next/server";
import { getTasks, getSprints } from "@/lib/db";

export async function GET() {
  const [backlog, sprints] = await Promise.all([getTasks(), getSprints()]);
  return NextResponse.json({ backlog, sprints });
}
