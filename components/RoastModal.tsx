"use client";

import { useEffect, useState } from "react";
import { Copy, Share2, Flame, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Props = { open: boolean; onOpenChange: (open: boolean) => void };

export function RoastModal({ open, onOpenChange }: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setText("");
    setLoading(true);
    fetch("/api/ai/roast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planned: 24, done: 21, spillover: "13%", sprintName: "Sprint 14" }),
    })
      .then((r) => r.json())
      .then((j) => setText(j.text ?? ""))
      .catch(() => setText(""))
      .finally(() => setLoading(false));
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 text-zinc-100 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" /> Roast My Sprint
          </DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex items-center gap-2 text-zinc-400">
            <Loader2 className="h-4 w-4 animate-spin" /> Generating roast…
          </div>
        ) : text ? (
          <p className="leading-relaxed">"{text}"</p>
        ) : (
          <p className="text-zinc-500 italic">No roast generated.</p>
        )}
        <DialogFooter>
          <Button variant="outline" size="sm" disabled={!text}
            onClick={() => navigator.clipboard?.writeText(text)}>
            <Copy className="h-4 w-4" /> Copy
          </Button>
          <Button
            variant="outline" size="sm" disabled={!text}
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: "Sprint Roast", text }).catch(() => {});
              } else {
                navigator.clipboard?.writeText(text);
              }
            }}
          >
            <Share2 className="h-4 w-4" /> Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
