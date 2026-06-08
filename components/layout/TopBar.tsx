"use client";

import { useState } from "react";
import { Settings, Sparkles, Download, Database, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApiData } from "@/hooks/useApiData";
import type { Sprint } from "@/lib/types";

const fallback = { sprints: [] as Sprint[], backlog: [] };

export function TopBar() {
  const { data } = useApiData("/api/data/planning", fallback);
  const sprints = data.sprints;
  const [sprintId, setSprintId] = useState("s14");
  const [importing, setImporting] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const handleImport = async () => {
    setImporting(true);
    try {
      const res = await fetch("/api/jira/import", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Import failed");
      toast.success(`Imported from Jira`, {
        description: `${json.imported.tasks} tasks, ${json.imported.sprints} sprints`,
      });
    } catch (e) {
      toast.error("Jira import failed", { description: String(e) });
    } finally {
      setImporting(false);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Seed failed");
      toast.success("Test data loaded", {
        description: `${json.seeded.tasks} tasks · ${json.seeded.teamMembers} team members`,
      });
    } catch (e) {
      toast.error("Seed failed", { description: String(e) });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
          <Sparkles className="h-4 w-4" />
        </div>
        <span className="tracking-tight">aigle</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Sprint</span>
        <Select value={sprintId} onValueChange={setSprintId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sprints.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                <div className="flex flex-col">
                  <span>{s.name}</span>
                  <span className="text-muted-foreground">{s.range}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" onClick={handleImport} disabled={importing}>
          {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Import from Jira
        </Button>

        <Button variant="outline" size="sm" onClick={handleSeed} disabled={seeding}>
          {seeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
          Load Test Data
        </Button>

        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
