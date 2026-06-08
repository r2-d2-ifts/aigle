"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Settings, Download, Database, Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApiData } from "@/hooks/useApiData";
import { createClient } from "@/lib/supabase-browser";
import type { Sprint } from "@/lib/types";

const fallback = { sprints: [] as Sprint[], backlog: [] };

export function TopBar() {
  const router = useRouter();
  const { data } = useApiData("/api/data/planning", fallback);
  const sprints = data.sprints;
  const [sprintId, setSprintId] = useState("s14");
  const [importing, setImporting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setEmail(user?.email ?? null));
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

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
        <Image src="/logo.jpg" alt="aigle" width={32} height={32} className="rounded-md" priority />
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

        {email && (
          <>
            <span className="ml-2 text-muted-foreground text-xs hidden md:inline">{email}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout} title="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
