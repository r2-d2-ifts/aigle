import { NextResponse } from "next/server";
import { getSprints, getVelocity, isConfigured } from "@/lib/jiraClient";
import { sprints, velocityTrend } from "@/lib/mockData";

export async function GET() {
  if (!isConfigured()) {
    return NextResponse.json({ source: "mock", sprints, velocityTrend });
  }
  try {
    const [sprintData, velocityData] = await Promise.all([getSprints(), getVelocity()]);
    return NextResponse.json({ source: "jira", sprints: sprintData, velocityTrend: velocityData });
  } catch {
    return NextResponse.json({ source: "mock", sprints, velocityTrend });
  }
}
