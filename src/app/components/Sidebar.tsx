import { LayoutDashboard, ListTodo, GitBranch, ClipboardCheck, Activity } from "lucide-react";
import { cn } from "./ui/utils";

export type ScreenKey = "dashboard" | "planning" | "breakdown" | "review" | "health";

const items: { key: ScreenKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "planning", label: "Sprint Planning", icon: ListTodo },
  { key: "breakdown", label: "Task Breakdown", icon: GitBranch },
  { key: "review", label: "Sprint Review", icon: ClipboardCheck },
  { key: "health", label: "Health & Risk", icon: Activity },
];

type Props = {
  active: ScreenKey;
  onSelect: (key: ScreenKey) => void;
};

export function Sidebar({ active, onSelect }: Props) {
  return (
    <aside className="flex w-56 flex-col gap-1 border-r border-border bg-card p-3">
      {items.map(({ key, label, icon: Icon }) => {
        const isActive = key === active;
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-left transition-colors",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        );
      })}
    </aside>
  );
}
