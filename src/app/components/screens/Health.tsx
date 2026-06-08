import { useState } from "react";
import { Play, ArrowDown, Lightbulb } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { HealthScoreGauge } from "../HealthScoreGauge";
import { blockableTasks, healthScore, impactChain } from "../../lib/mockData";

export function Health() {
  const [taskId, setTaskId] = useState(blockableTasks[0].id);
  const [simulated, setSimulated] = useState(false);

  const newScore = simulated ? 61 : healthScore;

  return (
    <div className="space-y-6">
      <div>
        <div className="text-muted-foreground">Sprint Health</div>
        <h2 className="tracking-tight">Score & Risk</h2>
      </div>

      <HealthScoreGauge score={newScore} />

      <Card>
        <CardHeader>
          <CardTitle>Butterfly Effect Simulator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-muted-foreground">Block task</span>
            <Select value={taskId} onValueChange={setTaskId}>
              <SelectTrigger className="w-[260px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {blockableTasks.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => setSimulated(true)}>
              <Play className="h-4 w-4" /> Simulate Impact
            </Button>
            {simulated && (
              <Button variant="ghost" onClick={() => setSimulated(false)}>
                Reset
              </Button>
            )}
          </div>

          {simulated && (
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="space-y-2">
                {impactChain.map((node, i) => {
                  const dot =
                    node.status === "blocked"
                      ? "bg-rose-500"
                      : node.status === "risk"
                      ? "bg-amber-500"
                      : "bg-emerald-500";
                  return (
                    <div key={i}>
                      <div
                        className="flex items-center gap-3"
                        style={{ paddingLeft: node.level * 24 }}
                      >
                        <span className={`h-3 w-3 rounded-full ${dot}`} />
                        <span>{node.label}</span>
                        {node.detail && (
                          <span className="text-muted-foreground">— {node.detail}</span>
                        )}
                      </div>
                      {i < impactChain.length - 1 && (
                        <ArrowDown
                          className="my-1 h-3 w-3 text-muted-foreground"
                          style={{ marginLeft: node.level * 24 + 4 }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <span>Health Score</span>
                <span>
                  <span className="text-muted-foreground">78</span> →{" "}
                  <span className="text-rose-400">61</span>{" "}
                  <span className="text-rose-400">(-17)</span>
                </span>
              </div>

              <div className="mt-3 flex items-start gap-2 rounded-md border border-indigo-500/30 bg-indigo-500/10 p-3 text-indigo-200">
                <Lightbulb className="mt-0.5 h-4 w-4 text-indigo-400" />
                <div>
                  <div>Mitigation</div>
                  <div className="text-muted-foreground">
                    Parallelize FE with mock API; unblock DB schema review by EOD.
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
