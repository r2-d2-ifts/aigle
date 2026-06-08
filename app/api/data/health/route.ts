import { NextResponse } from "next/server";
import { getHealthScore, getHealthFactors, getBlockableTasks } from "@/lib/db";

export async function GET() {
  const [healthScore, healthFactors, blockableTasks] = await Promise.all([
    getHealthScore(),
    getHealthFactors(),
    getBlockableTasks(),
  ]);
  return NextResponse.json({ healthScore, healthFactors, blockableTasks, impactChain: [] });
}
