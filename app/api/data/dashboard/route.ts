import { NextResponse } from "next/server";
import { getVelocityTrend, getPlannedVsDone, getHealthScore, getHealthFactors } from "@/lib/db";

export async function GET() {
  const [velocityTrend, plannedVsDone, healthScore, healthFactors] = await Promise.all([
    getVelocityTrend(),
    getPlannedVsDone(),
    getHealthScore(),
    getHealthFactors(),
  ]);
  return NextResponse.json({ velocityTrend, plannedVsDone, healthScore, healthFactors });
}
