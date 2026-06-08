"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Bug, BookOpen, CheckCircle2, XCircle, Sparkles, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useApiData } from "@/hooks/useApiData";
import type { BacklogTask, Sprint } from "@/lib/mockData";

type AISizing = {
  passes: boolean;
  aiSP?: number;
  confidence?: number;
  references?: number;
  rationale?: string;
  rejectReason?: string;
};

const fallback = {
  backlog: [] as BacklogTask[],
  sprints: [] as Sprint[],
};

export function PlanningScreen() {
  const { data } = useApiData("/api/data/planning", fallback);
  const [selectedId, setSelectedId] = useState<string>("");
  const [query, setQuery] = useState("");
  const [sizing, setSizing] = useState<Record<string, AISizing>>({});
  const [sizingLoading, setSizingLoading] = useState(false);

  const backlog = data.backlog;
  // Auto-select first task when backlog loads
  useEffect(() => {
    if (!selectedId && backlog.length > 0) setSelectedId(backlog[0].id);
  }, [backlog, selectedId]);

  const selected = backlog.find((t) => t.id === selectedId) ?? null;
  const filtered = backlog.filter((t) => t.title.toLowerCase().includes(query.toLowerCase()));

  const runSizing = useCallback(async (task: BacklogTask) => {
    if (sizing[task.id]) return;
    setSizingLoading(true);
    try {
      const res = await fetch("/api/ai/sizing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: task.title,
          description: task.rationale,
          references: task.references,
        }),
      });
      if (res.ok) {
        const result: AISizing = await res.json();
        setSizing((prev) => ({ ...prev, [task.id]: result }));
      }
    } catch {
      // Keep mock data on failure
    } finally {
      setSizingLoading(false);
    }
  }, [sizing]);

  useEffect(() => {
    if (selected) runSizing(selected);
  }, [selected, runSizing]);

  // Merge AI sizing with task data (AI overrides mock when available)
  const ai = sizing[selected?.id ?? ""];
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
          <div className="text-muted-foreground">{backlog.length} items</div>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search backlog…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <Button variant="outline">Filter</Button>
        </div>

        <div className="space-y-3">
          {filtered.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              aiResult={sizing[task.id]}
              active={task.id === selectedId}
              onSelect={() => setSelectedId(task.id)}
            />
          ))}
        </div>
      </div>

      {selected && (
        <Card className="sticky top-4 h-fit">
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
                <div className="h-16 animate-pulse rounded-lg bg-muted" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
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
                  <Button className="w-full"><Plus className="h-4 w-4" /> Add to Sprint</Button>
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
      )}
    </div>
  );
}

function TaskRow({
  task, aiResult, active, onSelect,
}: {
  task: BacklogTask;
  aiResult?: AISizing;
  active: boolean;
  onSelect: () => void;
}) {
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
