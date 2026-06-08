// Generate static Adaptive Card JSONs for Power Automate.
// Output: scripts/pa-cards/{summary,sprint,tasks,team}.json
// Each card embeds a snapshot of seed data — use directly in PA's
// "Post card in a chat or channel (V3)" action.

import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { sprints, tasks, teamMembers, sprintHealth } from "../lib/seedData.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "pa-cards");
await mkdir(outDir, { recursive: true });

function card(title, color, body, facts) {
  return {
    type: "AdaptiveCard",
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
    version: "1.4",
    body: [
      { type: "TextBlock", text: title, weight: "Bolder", size: "Large", color },
      ...(body ? [{ type: "TextBlock", text: body, wrap: true, isSubtle: true }] : []),
      ...(facts?.length ? [{ type: "FactSet", facts }] : []),
    ],
  };
}

const active = sprints[sprints.length - 1];
const latestHealth = sprintHealth[sprintHealth.length - 1];
const planned = active?.planned_sp ?? 0;
const done = active?.done_sp ?? 0;

const summary = card("🎯 Sprint Özeti", "Accent", "aigle anlık durum (snapshot)", [
  { title: "Aktif Sprint", value: active?.name ?? "—" },
  { title: "Health Score", value: `${latestHealth?.health_score ?? 0} / 100` },
  { title: "Planlanan", value: `${planned} SP` },
  { title: "Tamamlanan", value: `${done} SP` },
  { title: "Tamamlama", value: planned > 0 ? `${Math.round((done / planned) * 100)}%` : "—" },
]);

const sprint = card("📅 Sprint Geçmişi", "Accent", null,
  sprints.map((s) => ({ title: s.name, value: `${s.velocity} SP (planned ${s.planned_sp})` }))
);

const passing = tasks.filter((t) => t.passes).length;
const tasksCard = card("📝 Backlog", "Good", `${tasks.length} task, ${passing} kalite kapısından geçti`,
  tasks.slice(0, 6).map((t) => ({ title: `${t.passes ? "✅" : "❌"} ${t.title}`, value: `AI: ${t.ai_sp} SP` }))
);

const teamLoaded = teamMembers.some((m) => m.current_load >= 80);
const team = card("👥 Takım", teamLoaded ? "Warning" : "Good", `${teamMembers.length} aktif takım üyesi`,
  teamMembers.map((m) => ({ title: m.name, value: `${m.current_load}% load` }))
);

const files = { summary, sprint, tasks: tasksCard, team };
for (const [name, content] of Object.entries(files)) {
  const path = join(outDir, `${name}.json`);
  await writeFile(path, JSON.stringify(content, null, 2), "utf8");
  console.log(`✓ ${path}`);
}

console.log(`\nPaste each into Power Automate "Post card in a chat or channel (V3)" action.`);
