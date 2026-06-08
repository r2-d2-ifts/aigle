"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Copy, Download, Flame, Sparkles, Gauge, AlertCircle, Clock, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricCard } from "@/components/MetricCard";
import { RoastModal } from "@/components/RoastModal";
import { useApiData } from "@/hooks/useApiData";

const fallback = {
  velocityTrend: [] as { sprint: string; velocity: number }[],
  plannedVsDone: [] as { name: string; Planned: number; Done: number }[],
  healthScore: 0,
  healthFactors: [] as { name: string; value: number; status: "ok" | "warn" }[],
};

export function ReviewScreen() {
  const { data, loading: dataLoading } = useApiData("/api/data/dashboard", fallback);
  const [narrative, setNarrative] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [roastOpen, setRoastOpen] = useState(false);

  const generateReview = async () => {
    setNarrative("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planned: 24, done: 21, spillover: "13%", blockers: 2, sprintName: "Sprint 14" }),
      });
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          setNarrative((prev) => prev + decoder.decode(value, { stream: true }));
        }
      }
    } catch {
      setNarrative("Sprint review generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-muted-foreground">Retrospective</div>
          <h2 className="tracking-tight">Sprint 14 Review</h2>
        </div>
        <Button onClick={generateReview} disabled={loading}>
          <Sparkles className="h-4 w-4" /> {loading ? "Generating…" : "Generate Review"}
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader><CardTitle>Planned vs Done</CardTitle></CardHeader>
          <CardContent>
            {dataLoading ? <Skeleton className="h-[260px] w-full" /> : (
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={data.plannedVsDone} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="Planned" fill="#a78bfa" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Done" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <MetricCard label="Velocity" value="42 SP" icon={Gauge} sub="planned 24" />
          <MetricCard label="Spillover" value="13%" icon={AlertCircle} sub="3 tasks" />
          <MetricCard label="Cycle Time" value="2.3d" icon={Clock} sub="median" />
          <MetricCard label="Blocked" value="2" icon={Ban} sub="DB, BE" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-500" /> AI Review Narrative
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && !narrative ? (
            <div className="space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-muted" />
              <div className="h-3 w-11/12 animate-pulse rounded bg-muted" />
              <div className="h-3 w-9/12 animate-pulse rounded bg-muted" />
            </div>
          ) : narrative ? (
            <p className="leading-relaxed">{narrative}</p>
          ) : (
            <p className="text-muted-foreground italic">Click "Generate Review" to produce an AI sprint summary.</p>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={!narrative}
                onClick={() => navigator.clipboard?.writeText(narrative)}>
                <Copy className="h-4 w-4" /> Copy
              </Button>
              <Button variant="outline" size="sm" disabled={!narrative}>
                <Download className="h-4 w-4" /> Export
              </Button>
            </div>
            <Button variant="destructive" onClick={() => setRoastOpen(true)}>
              <Flame className="h-4 w-4" /> Roast My Sprint
            </Button>
          </div>
        </CardContent>
      </Card>

      <RoastModal open={roastOpen} onOpenChange={setRoastOpen} />
    </div>
  );
}
