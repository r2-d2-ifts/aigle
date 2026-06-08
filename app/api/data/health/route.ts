import { NextResponse } from "next/server";
import { getHealthScore, getHealthFactors } from "@/lib/db";
import { blockableTasks, impactChain } from "@/lib/mockData";

export async function GET() {
  const [healthScore, healthFactors] = await Promise.all([getHealthScore(), getHealthFactors()]);
  return NextResponse.json({ healthScore, healthFactors, blockableTasks, impactChain });
}
