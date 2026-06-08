import type { LucideIcon } from "lucide-react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { cn } from "./ui/utils";

type Props = {
  label: string;
  value: string;
  delta?: { direction: "up" | "down" | "flat"; text: string };
  sub?: string;
  icon?: LucideIcon;
};

export function MetricCard({ label, value, delta, sub, icon: Icon }: Props) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>{label}</span>
          {Icon ? <Icon className="h-4 w-4" /> : null}
        </div>
        <div className="tracking-tight" style={{ fontSize: 28, lineHeight: 1.1 }}>
          {value}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          {delta && (
            <span
              className={cn(
                "inline-flex items-center gap-1",
                delta.direction === "up" && "text-emerald-500",
                delta.direction === "down" && "text-rose-500"
              )}
            >
              {delta.direction === "up" && <ArrowUp className="h-3 w-3" />}
              {delta.direction === "down" && <ArrowDown className="h-3 w-3" />}
              {delta.text}
            </span>
          )}
          {sub && <span>{sub}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
