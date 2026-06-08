"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  text?: string;
  facts?: { title: string; value: string }[];
  color?: "good" | "warning" | "attention" | "accent" | "default";
  label?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm";
};

export function TeamsButton({ title, text, facts, color, label = "Send to Teams", variant = "outline", size = "sm" }: Props) {
  const [busy, setBusy] = useState(false);

  const send = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/teams-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, text, facts, color }),
      });
      if (res.status === 503) {
        toast.error("Teams not configured", { description: "Add TEAMS_WEBHOOK_URL to .env.local" });
      } else if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        toast.error("Teams send failed", { description: j.error ?? `HTTP ${res.status}` });
      } else {
        toast.success("Teams kanalına gönderildi 🎉");
      }
    } catch (e) {
      toast.error("Network error", { description: String(e) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button variant={variant} size={size} onClick={send} disabled={busy}>
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
      {label}
    </Button>
  );
}
