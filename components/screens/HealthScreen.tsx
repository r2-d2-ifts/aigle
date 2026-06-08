"use client";

import { useState, useEffect } from "react";
import { Play, ArrowDown, Lightbulb, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HealthScoreGauge } from "@/components/HealthScoreGauge";
import { useApiData } from "@/hooks/useApiData";

type ImpactNode = { level: number; status: "blocked" | "risk" | "ok"; label: string; detail: string };

const fallback = {
  healthScore: 0,
  healthFactors: [] as { name: string; value: number; status: "ok" | "warn" }[],
  blockableTasks: [] as { id: string; name: string }[],
  impactChain: [] as ImpactNode[],
};

export function HealthScreen() {
  const { data } = useApiData("/api/data/health", fallback);
  const [taskId, setTaskId] = useState<string>("");
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    if (!taskId && data.blockableTasks.length > 0) setTaskId(data.blockableTasks[0].id);
  }, [data.blockableTasks, taskId]);
  const [simResult, setSimResult] = useState<{
    impactChain: ImpactNode[];
    healthDelta: number;
    mitigation: string;
  } | null>(null);

  const displayScore = simResult
    ? Math.max(0, data.healthScore + simResult.healthDelta)
    : data.healthScore;

  const handleSimulate = async () => {
    setSimulating(true);
    setSimResult(null);
    const blocked = data.blockableTasks.find((t) => t.id === taskId);
    try {
      const res = await fetch("/api/risk/butterfly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blockedTask: blocked?.name ?? taskId, sprintTasks: data.blockableTasks }),
      });
      if (res.ok) {
        const json = await res.json();
        setSimResult(json);
      }
    } catch {
      setSimResult({ impactChain: data.impactChain, healthDelta: -17, mitigation: "Parallelize FE with mock API; unblock DB schema review by EOD." });
    } finally {
      setSimulating(false);
    }
  };

  const chain = simResult?.impactChain ?? data.impactChain;

  return (
    <div className="space-y-6">
      <div>
        <div className="text-muted-foreground">Sprint Health</div>
        <h2 className="tracking-tight">Score & Risk</h2>
      </div>

      <HealthScoreGauge score={displayScore} />

      <Card>
        <CardHeader><CardTitle>Butterfly Effect Simulator</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-muted-foreground">Block task</span>
            <Select value={taskId} onValueChange={setTaskId}>
              <SelectTrigger className="w-[260px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {data.blockableTasks.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSimulate} disabled={simulating}>
              {simulating
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Simulating…</>
                : <><Play className="h-4 w-4" /> Simulate Impact</>}
            </Button>
            {simResult && (
              <Button variant="ghost" onClick={() => setSimResult(null)}>Reset</Button>
            )}
          </div>

          {simResult && (
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="space-y-2">
                {chain.map((node, i) => {
                  const dot = node.status === "blocked" ? "bg-rose-500" : node.status === "risk" ? "bg-amber-500" : "bg-emerald-500";
                  return (
                    <div key={i}>
                      <div className="flex items-center gap-3" style={{ paddingLeft: node.level * 24 }}>
                        <span className={`h-3 w-3 rounded-full ${dot}`} />
                        <span>{node.label}</span>
                        {node.detail && <span className="text-muted-foreground">— {node.detail}</span>}
                      </div>
                      {i < chain.length - 1 && (
                        <ArrowDown className="my-1 h-3 w-3 text-muted-foreground" style={{ marginLeft: node.level * 24 + 4 }} />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <span>Health Score</span>
                <span>
                  <span className="text-muted-foreground">{data.healthScore}</span> →{" "}
                  <span className="text-rose-400">{displayScore}</span>{" "}
                  <span className="text-rose-400">({simResult.healthDelta})</span>
                </span>
              </div>

              <div className="mt-3 flex items-start gap-2 rounded-md border border-indigo-500/30 bg-indigo-500/10 p-3 text-indigo-200">
                <Lightbulb className="mt-0.5 h-4 w-4 text-indigo-400" />
                <div>
                  <div>Mitigation</div>
                  <div className="text-muted-foreground">{simResult.mitigation}</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
