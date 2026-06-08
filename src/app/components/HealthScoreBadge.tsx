import { Card, CardContent } from "./ui/card";
import { healthColor, healthLabel } from "../lib/mockData";

type Props = { score: number };

export function HealthScoreBadge({ score }: Props) {
  const color = healthColor(score);
  const label = healthLabel(score);
  const bar =
    color === "emerald"
      ? "bg-emerald-500"
      : color === "amber"
      ? "bg-amber-500"
      : "bg-rose-500";
  const text =
    color === "emerald"
      ? "text-emerald-500"
      : color === "amber"
      ? "text-amber-500"
      : "text-rose-500";

  return (
    <Card>
      <CardContent className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Health Score</span>
          <span className={text}>{label}</span>
        </div>
        <div className="tracking-tight" style={{ fontSize: 28, lineHeight: 1.1 }}>
          {score}
          <span className="text-muted-foreground" style={{ fontSize: 14 }}>
            {" "}
            / 100
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className={`${bar} h-full`} style={{ width: `${score}%` }} />
        </div>
      </CardContent>
    </Card>
  );
}
