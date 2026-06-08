import { useState } from "react";
import { TopBar } from "./components/TopBar";
import { Sidebar, type ScreenKey } from "./components/Sidebar";
import { Dashboard } from "./components/screens/Dashboard";
import { Planning } from "./components/screens/Planning";
import { Breakdown } from "./components/screens/Breakdown";
import { Review } from "./components/screens/Review";
import { Health } from "./components/screens/Health";
import { RoastModal } from "./components/RoastModal";

export default function App() {
  const [screen, setScreen] = useState<ScreenKey>("dashboard");
  const [sprintId, setSprintId] = useState("s14");
  const [roastOpen, setRoastOpen] = useState(false);

  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground">
      <TopBar sprintId={sprintId} onSprintChange={setSprintId} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar active={screen} onSelect={setScreen} />
        <main className="flex-1 overflow-auto p-6">
          {screen === "dashboard" && (
            <Dashboard
              onRoast={() => setRoastOpen(true)}
              onNewPlanning={() => setScreen("planning")}
            />
          )}
          {screen === "planning" && <Planning />}
          {screen === "breakdown" && <Breakdown />}
          {screen === "review" && <Review onRoast={() => setRoastOpen(true)} />}
          {screen === "health" && <Health />}
        </main>
      </div>
      <RoastModal open={roastOpen} onOpenChange={setRoastOpen} />
    </div>
  );
}
