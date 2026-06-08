import { NextResponse } from "next/server";
import { getBacklog, isConfigured } from "@/lib/jiraClient";
import { backlog } from "@/lib/mockData";

export async function GET() {
  if (!isConfigured()) {
    return NextResponse.json({ source: "mock", data: backlog });
  }
  try {
    const data = await getBacklog();
    return NextResponse.json({ source: "jira", data });
  } catch {
    return NextResponse.json({ source: "mock", data: backlog });
  }
}
