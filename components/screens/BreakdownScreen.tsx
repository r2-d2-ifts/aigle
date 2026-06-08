"use client";

import { useState, useEffect, useCallback } from "react";
import { Monitor, Server, Database, FlaskConical, RotateCcw, Sparkles, Loader2, Bug, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiData } from "@/hooks/useApiData";
import type { BacklogTask, Subtask } from "@/lib/types";

const planningFallback = { backlog: [] as BacklogTask[], sprints: [] };
const teamFallback = { teamLoad: [] as { name: string; load: number }[] };

type AssignedSubtask = Subtask & { description?: string; dependencies?: string[] };

const typeStyle: Record<string, { icon: typeof Monitor; cls: string }> = {
  FE:   { icon: Monitor,      cls: "bg-sky-500/15 text-sky-400 border-sky-500/30" },
  BE:   { icon: Server,       cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  DB:   { icon: Database,     cls: "bg-orange-500/15 text-orange-400 border-orange-500/30" },
  Test: { icon: FlaskConical, cls: "bg-purple-500/15 text-purple-400 border-purple-500/30" },
};

export function BreakdownScreen() {
  const { data: planningData, loading: planningLoading } = useApiData("/api/data/planning", planningFallback);
  const { data: teamData, loading: teamLoading } = useApiData("/api/data/breakdown", teamFallback);

  const [selectedId, setSelectedId] = useState<string>("");
  const [subtasks, setSubtasks] = useState<AssignedSubtask[]>([]);
  const [rationale, setRationale] = useState<{ person: string; text: string }[]>([]);
  const [decomposing, setDecomposing] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [streamText, setStreamText] = useState("");

  const backlog = planningData.backlog;
  const selectedTask = backlog.find((t) => t.id === selectedId) ?? null;
  const total = subtasks.reduce((sum, s) => sum + s.sp, 0);
  const busy = decomposing || assigning;

  // Auto-select first task when backlog loads
  useEffect(() => {
    if (!selectedId && backlog.length > 0) setSelectedId(backlog[0].id);
  }, [backlog, selectedId]);

  const runDecompose = useCallback(async (task: BacklogTask) => {
    setDecomposing(true);
    setStreamText("");
    setSubtasks([]);
    setRationale([]);

    try {
      const res = await fetch("/api/ai/breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: task.title,
          description: task.rationale,
          totalSP: task.aiSP || 5,
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          accumulated += chunk;
          setStreamText(accumulated);
        }
      }

      setDecomposing(false);

      const raw = JSON.parse(accumulated);
      const parsed: AssignedSubtask[] = Array.isArray(raw) ? raw : (raw.subtasks ?? []);
      setSubtasks(parsed);

      if (parsed.length === 0) return;

      setAssigning(true);
      const assignRes = await fetch("/api/ai/assignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subtasks: parsed }),
      });

      if (assignRes.ok) {
        const { subtasks: assigned, rationale: newRationale } = await assignRes.json();
        setSubtasks(assigned);
        setRationale(newRationale);
      }
    } catch {
      setSubtasks([]);
      setRationale([]);
    } finally {
      setDecomposing(false);
      setAssigning(false);
      setStreamText("");
    }
  }, []);

  // Auto-run when a task is selected
  useEffect(() => {
    if (selectedTask) runDecompose(selectedTask);
  }, [selectedTask?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectChange = (id: string) => {
    setSelectedId(id);
    // runDecompose is triggered by the useEffect above when selectedTask changes
  };

  return (
    <div className="space-y-6">
      {/* Task selector */}
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <span className="shrink-0 text-muted-foreground">Task</span>
            {planningLoading && backlog.length === 0 ? (
              <Skeleton className="h-9 w-full max-w-sm" />
            ) : (
              <Select value={selectedId} onValueChange={handleSelectChange} disabled={busy}>
                <SelectTrigger className="w-full max-w-sm" data-testid="task-select">
                  <SelectValue placeholder="Select a task…" />
                </SelectTrigger>
                <SelectContent>
                  {backlog.map((task) => {
                    const Icon = task.type === "bug" ? Bug : BookOpen;
                    return (
                      <SelectItem key={task.id} value={task.id}>
                        <div className="flex items-center gap-2">
                          <Icon className={`h-3.5 w-3.5 shrink-0 ${task.type === "bug" ? "text-rose-500" : "text-sky-500"}`} />
                          <span className="truncate">{task.title}</span>
                          <span className="shrink-0 text-muted-foreground">· {task.aiSP} SP</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!busy && subtasks.length > 0 && (
              <Badge variant="secondary" className="px-3 py-1">{total} SP total</Badge>
            )}
            <Button
              variant="outline"
              onClick={() => selectedTask && runDecompose(selectedTask)}
              disabled={busy || !selectedTask}
            >
              {busy
                ? <><Loader2 className="h-4 w-4 animate-spin" />{assigning ? "Assigning…" : "Decomposing…"}</>
                : <><RotateCcw className="h-4 w-4" /> Re-run</>}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Streaming preview */}
      {streamText && decomposing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-500" /> Generating sub-tasks…
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap font-mono text-xs text-muted-foreground">{streamText}</pre>
          </CardContent>
        </Card>
      )}

      {/* Sub-tasks table */}
      <Card>
        <CardHeader><CardTitle>Sub-tasks</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">Type</TableHead>
                <TableHead>Sub-task</TableHead>
                <TableHead className="w-20">SP</TableHead>
                <TableHead className="w-40">Assigned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {decomposing || (busy && subtasks.length === 0) ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  </TableRow>
                ))
              ) : subtasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                    No sub-tasks generated.
                  </TableCell>
                </TableRow>
              ) : (
                subtasks.map((s, i) => {
                  const meta = typeStyle[s.type] ?? typeStyle.FE;
                  const Icon = meta.icon;
                  return (
                    <TableRow key={i}>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 ${meta.cls}`}>
                          <Icon className="h-3.5 w-3.5" /> {s.type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>{s.name}</div>
                        {s.description && <div className="text-xs text-muted-foreground">{s.description}</div>}
                      </TableCell>
                      <TableCell>{s.sp}</TableCell>
                      <TableCell>{s.assignee ?? <span className="text-muted-foreground">TBD</span>}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Rationale + Team Load */}
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-500" /> Assignment Rationale
              {assigning && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {assigning && rationale.length === 0
              ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
              : rationale.length === 0
                ? <p className="text-sm italic text-muted-foreground">Assignment rationale will appear after decomposition.</p>
                : rationale.map((r, i) => (
                    <div key={i} className="rounded-md border border-border bg-muted/30 p-3">
                      <div className="text-indigo-400">{r.person}</div>
                      <div className="text-muted-foreground">{r.text}</div>
                    </div>
                  ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Team Load</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {teamLoading && teamData.teamLoad.length === 0
              ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
              : teamData.teamLoad.map((p) => (
                <div key={p.name}>
                  <div className="mb-1 flex items-center justify-between">
                    <span>{p.name}</span>
                    <span className="text-muted-foreground">{p.load}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={p.load >= 80 ? "h-full bg-rose-500" : p.load >= 60 ? "h-full bg-amber-500" : "h-full bg-emerald-500"}
                      style={{ width: `${p.load}%` }}
                    />
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
