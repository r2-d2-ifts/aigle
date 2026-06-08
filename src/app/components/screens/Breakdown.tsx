import { Monitor, Server, Database, FlaskConical, Play, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { subtasks, assignmentRationale, teamLoad } from "../../lib/mockData";

const typeStyle: Record<string, { icon: typeof Monitor; cls: string }> = {
  FE: { icon: Monitor, cls: "bg-sky-500/15 text-sky-400 border-sky-500/30" },
  BE: { icon: Server, cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  DB: { icon: Database, cls: "bg-orange-500/15 text-orange-400 border-orange-500/30" },
  Test: { icon: FlaskConical, cls: "bg-purple-500/15 text-purple-400 border-purple-500/30" },
};

export function Breakdown() {
  const total = subtasks.reduce((sum, s) => sum + s.sp, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <div className="text-muted-foreground">Task</div>
            <h2 className="tracking-tight">"Implement Payment Flow"</h2>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="px-3 py-1">{total} SP total</Badge>
            <Button>
              <Play className="h-4 w-4" /> Decompose
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sub-tasks</CardTitle>
        </CardHeader>
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
              {subtasks.map((s, i) => {
                const meta = typeStyle[s.type];
                const Icon = meta.icon;
                return (
                  <TableRow key={i}>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 ${meta.cls}`}
                      >
                        <Icon className="h-3.5 w-3.5" /> {s.type}
                      </span>
                    </TableCell>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.sp}</TableCell>
                    <TableCell>{s.assignee}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-500" /> Assignment Rationale
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {assignmentRationale.map((r) => (
              <div
                key={r.person}
                className="rounded-md border border-border bg-muted/30 p-3"
              >
                <div className="text-indigo-400">{r.person}</div>
                <div className="text-muted-foreground">{r.text}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Load</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamLoad.map((p) => (
              <div key={p.name}>
                <div className="mb-1 flex items-center justify-between">
                  <span>{p.name}</span>
                  <span className="text-muted-foreground">{p.load}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={
                      p.load >= 80
                        ? "h-full bg-rose-500"
                        : p.load >= 60
                        ? "h-full bg-amber-500"
                        : "h-full bg-emerald-500"
                    }
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
