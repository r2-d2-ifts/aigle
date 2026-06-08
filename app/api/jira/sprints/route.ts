import { NextResponse } from "next/server";
import { getSprints, getVelocityTrend } from "@/lib/db";

export async function GET() {
  const [sprints, velocityTrend] = await Promise.all([getSprints(), getVelocityTrend()]);
  return NextResponse.json({ source: "supabase", sprints, velocityTrend });
}
