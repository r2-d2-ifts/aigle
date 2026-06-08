"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Bug, BookOpen, CheckCircle2, XCircle, Sparkles, Plus, Loader2, AlertTriangle, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApiData } from "@/hooks/useApiData";
import type { BacklogTask, Sprint } from "@/lib/types";

type AISizing = {
  passes: boolean;
  aiSP?: number;
  confidence?: number;
  references?: number;
  rationale?: string;
  rejectReason?: string;
};

type BlockerRisk = {
  riskPct: number;
  topCauses: { cause: string; probability: number; reasoning: string }[];
  mitigations: string[];
};

const fallback = {
  backlog: [] as BacklogTask[],
  sprints: [] as Sprint[],
};

export function PlanningScreen() {
  const { data, loading, refresh } = useApiData("/api/data/planning", fallback);
  const [selectedId, setSelectedId] = useState<string>("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "story" | "bug">("all");
  const [sizing, setSizing] = useState<Record<string, AISizing>>({});
  const [sizingLoading, setSizingLoading] = useState(false);
  const [riskByTask, setRiskByTask] = useState<Record<string, BlockerRisk>>({});
  const [riskLoading, setRiskLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const backlog = data.backlog;

  useEffect(() => {
    if (!selectedId && backlog.length > 0) setSelectedId(backlog[0].id);
  }, [backlog, selectedId]);

  const selected = backlog.find((t) => t.id === selectedId) ?? null;
  const filtered = backlog
    .filter((t) => filter === "all" || t.type === filter)
    .filter((t) => t.title.toLowerCase().includes(query.toLowerCase()));

  const runSizing = useCallback(async (task: BacklogTask) => {
    if (sizing[task.id]) return;
    setSizingLoading(true);
    try {
      const res = await fetch("/api/ai/sizing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: task.title, description: task.rationale, references: task.references }),
      });
      if (res.ok) {
        const j = await res.json();
        setSizing((p) => ({ ...p, [task.id]: j }));
      }
    } catch {} finally { setSizingLoading(false); }
  }, [sizing]);

  const runRisk = useCallback(async (task: BacklogTask) => {
    if (riskByTask[task.id]) return;
    setRiskLoading(true);
    try {
      const res = await fetch("/api/ai/blocker-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: task.title, description: task.rationale, type: task.type }),
      });
      if (res.ok) {
        const j = await res.json();
        setRiskByTask((p) => ({ ...p, [task.id]: j }));
      }
    } catch {} finally { setRiskLoading(false); }
  }, [riskByTask]);

  useEffect(() => {
    if (selected) { runSizing(selected); runRisk(selected); }
  }, [selected, runSizing, runRisk]);

  const handleAddToSprint = async () => {
    if (!selected) return;
    setAdding(true);
    try {
      const res = await fetch("/api/sprint/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: selected.id }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error ?? "Add failed");
      toast.success(`"${selected.title}" added to sprint`);
      refresh();
    } catch (e) {
      toast.error("Add to sprint failed", { description: String(e) });
    } finally { setAdding(false); }
  };

  const ai = sizing[selected?.id ?? ""];
  const risk = riskByTask[selected?.id ?? ""];
  const passes = ai ? ai.passes : (selected?.passes ?? true);
  const aiSP = ai?.aiSP ?? selected?.aiSP ?? 0;
  const confidence = ai?.confidence ?? selected?.confidence ?? 0;
  const references = ai?.references ?? selected?.references ?? 0;
  const rationale = ai?.rationale ?? selected?.rationale ?? "";
  const rejectReason = ai?.rejectReason ?? selected?.rejectReason;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="tracking-tight">Backlog</h2>
          <div className="text-muted-foreground">{filtered.length} / {backlog.length} items</div>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search backlog…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="story">Stories</SelectItem>
              <SelectItem value="bug">Bugs</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {loading && filtered.length === 0 ? (
            Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
          ) : filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
              No backlog tasks. Click "Load Test Data" or "Import from Jira".
            </div>
          ) : (
            filtered.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                aiResult={sizing[task.id]}
                active={task.id === selectedId}
                onSelect={() => setSelectedId(task.id)}
              />
            ))
          )}
        </div>
      </div>

      {selected && (
        <div className="space-y-4 sticky top-4 h-fit">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                AI Sizing
                {sizingLoading && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-muted-foreground">Selected Task</div>
                <div className="tracking-tight">"{selected.title}"</div>
              </div>

              {sizingLoading && !ai ? (
                <div className="space-y-2">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : (
                <>
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <div className="text-muted-foreground">Suggested</div>
                    <div className="tracking-tight" style={{ fontSize: 36, lineHeight: 1 }}>
                      {aiSP} <span className="text-muted-foreground" style={{ fontSize: 14 }}>SP</span>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-muted-foreground">Confidence</span>
                      <span>{confidence}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={confidence >= 75 ? "h-full bg-emerald-500" : confidence >= 50 ? "h-full bg-amber-500" : "h-full bg-rose-500"}
                        style={{ width: `${confidence}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>References</span><span>{references}</span>
                  </div>

                  {rationale && (
                    <blockquote className="border-l-2 border-indigo-500 pl-3 italic text-muted-foreground">
                      "{rationale}"
                    </blockquote>
                  )}

                  {passes ? (
                    <Button className="w-full" onClick={handleAddToSprint} disabled={adding}>
                      {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                      Add to Sprint
                    </Button>
                  ) : (
                    <div className="rounded-md border border-rose-500/40 bg-rose-500/10 p-3 text-rose-400">
                      <div className="flex items-center gap-2"><XCircle className="h-4 w-4" /> Anti-Bullshit gate rejected</div>
                      <div className="mt-1 text-muted-foreground">{rejectReason}</div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Blocker Risk panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Blocker Risk
                {riskLoading && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {riskLoading && !risk ? (
                <Skeleton className="h-24 w-full" />
              ) : risk && risk.riskPct > 0 ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl tracking-tight">{risk.riskPct}%</div>
                    <div className="text-muted-foreground text-sm">block risk</div>
                  </div>
                  <div className="space-y-2">
                    {risk.topCauses.slice(0, 3).map((c, i) => (
                      <div key={i} className="rounded-md border border-amber-500/30 bg-amber-500/5 p-2 text-sm">
                        <div className="flex justify-between">
                          <span>{c.cause}</span>
                          <span className="text-amber-400">{c.probability}%</span>
                        </div>
                        <div className="text-muted-foreground text-xs mt-1">{c.reasoning}</div>
                      </div>
                    ))}
                  </div>
                  {risk.mitigations.length > 0 && (
                    <div className="rounded-md border border-indigo-500/30 bg-indigo-500/10 p-2">
                      <div className="flex items-center gap-1 text-indigo-300 text-sm mb-1">
                        <Lightbulb className="h-3 w-3" /> Mitigations
                      </div>
                      <ul className="text-muted-foreground text-xs space-y-1">
                        {risk.mitigations.map((m, i) => <li key={i}>• {m}</li>)}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-muted-foreground text-sm">No significant blocker risk.</div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function TaskRow({
  task, aiResult, active, onSelect,
}: { task: BacklogTask; aiResult?: AISizing; active: boolean; onSelect: () => void }) {
  const Icon = task.type === "bug" ? Bug : BookOpen;
  const passes = aiResult ? aiResult.passes : task.passes;
  const aiSP = aiResult?.aiSP ?? task.aiSP;

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-lg border p-3 transition-colors ${active ? "border-indigo-500 bg-indigo-500/5" : "border-border hover:bg-accent/50"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Icon className={`mt-0.5 h-4 w-4 ${task.type === "bug" ? "text-rose-500" : "text-sky-500"}`} />
          <div>
            <div>{task.title}</div>
            <div className="mt-1 flex items-center gap-2 text-muted-foreground">
              <span>Current: {task.currentSP ?? "?"} SP</span>
              <span>·</span>
              <Badge variant="secondary">AI: {aiSP} SP</Badge>
            </div>
          </div>
        </div>
        {passes ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <XCircle className="h-5 w-5 text-rose-500" />}
      </div>
      {!passes && <div className="mt-2 text-rose-400">⛔ {aiResult?.rejectReason ?? task.rejectReason}</div>}
    </button>
  );
}
