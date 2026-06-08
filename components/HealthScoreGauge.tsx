"use client";

import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { healthColor, healthLabel } from "@/lib/utils";

type Factor = { name: string; value: number; status: "ok" | "warn" };
type Props = { score: number; factors?: Factor[] };

export function HealthScoreGauge({ score, factors = [] }: Props) {
  const color = healthColor(score);
  const label = healthLabel(score);
  const ring =
    color === "emerald" ? "stroke-emerald-500" : color === "amber" ? "stroke-amber-500" : "stroke-rose-500";
  const text =
    color === "emerald" ? "text-emerald-500" : color === "amber" ? "text-amber-500" : "text-rose-500";

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <Card>
      <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center">
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg width="180" height="180" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r={radius} strokeWidth="14" fill="none" className="stroke-muted" />
              <circle
                cx="90" cy="90" r={radius} strokeWidth="14" fill="none"
                strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
                transform="rotate(-90 90 90)" className={ring}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="tracking-tight" style={{ fontSize: 36, lineHeight: 1 }}>{score}</span>
              <span className="text-muted-foreground">/ 100</span>
              <span className={`mt-1 ${text}`}>{label}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          {factors.map((f) => {
            const bar = f.status === "ok" ? "bg-emerald-500" : "bg-amber-500";
            const Icon = f.status === "ok" ? CheckCircle2 : f.status === "warn" ? AlertTriangle : XCircle;
            const iconColor = f.status === "ok" ? "text-emerald-500" : "text-amber-500";
            return (
              <div key={f.name} className="flex items-center gap-3">
                <div className="w-24 text-muted-foreground">{f.name}</div>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className={`${bar} h-full`} style={{ width: `${f.value}%` }} />
                </div>
                <div className="w-10 text-right">{f.value}%</div>
                <Icon className={`h-4 w-4 ${iconColor}`} />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
