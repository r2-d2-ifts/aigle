"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Gauge, CheckCircle2, AlertCircle, Flame, Plus } from "lucide-react";
import {
  CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";
import { HealthScoreBadge } from "@/components/HealthScoreBadge";
import { RoastModal } from "@/components/RoastModal";
import { useApiData } from "@/hooks/useApiData";
import {
  velocityTrend as mockVelocityTrend,
  plannedVsDone as mockPlannedVsDone,
  healthScore as mockHealthScore,
  healthFactors as mockHealthFactors,
} from "@/lib/mockData";

const fallback = {
  velocityTrend: mockVelocityTrend,
  plannedVsDone: mockPlannedVsDone,
  healthScore: mockHealthScore,
  healthFactors: mockHealthFactors,
};

export function DashboardScreen() {
  const router = useRouter();
  const [roastOpen, setRoastOpen] = useState(false);
  const { data } = useApiData("/api/data/dashboard", fallback);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-muted-foreground">Overview</div>
          <h2 className="tracking-tight">Sprint 14 Dashboard</h2>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.push("/planning")}>
            <Plus className="h-4 w-4" /> New Planning
          </Button>
          <Button variant="outline" onClick={() => setRoastOpen(true)}>
            <Flame className="h-4 w-4 text-orange-500" /> Roast This Sprint
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Velocity" value="42 SP" delta={{ direction: "up", text: "+8 vs avg" }} icon={Gauge} />
        <MetricCard label="Done" value="87%" sub="21 / 24 SP" icon={CheckCircle2} />
        <MetricCard label="Spillover" value="13%" sub="3 tasks" delta={{ direction: "down", text: "-4 vs prev" }} icon={AlertCircle} />
        <HealthScoreBadge score={data.healthScore} />
      </div>

      <Card>
        <CardHeader><CardTitle>Velocity Trend</CardTitle></CardHeader>
        <CardContent>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={data.velocityTrend} margin={{ top: 10, right: 20, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="sprint" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="velocity" stroke="#6366f1" strokeWidth={3} dot={{ r: 5, fill: "#6366f1" }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <RoastModal open={roastOpen} onOpenChange={setRoastOpen} />
    </div>
  );
}
