import { Settings, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { sprints } from "../lib/mockData";

type Props = {
  sprintId: string;
  onSprintChange: (id: string) => void;
};

export function TopBar({ sprintId, onSprintChange }: Props) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
          <Sparkles className="h-4 w-4" />
        </div>
        <span className="tracking-tight">AgileMind AI</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-muted-foreground">Sprint</span>
        <Select value={sprintId} onValueChange={onSprintChange}>
          <SelectTrigger className="w-[220px]">
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
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4" />
          Config
        </Button>
      </div>
    </header>
  );
}
