import { NextRequest } from "next/server";
import { buildCard, postToTeams, isTeamsConfigured } from "@/lib/teams";
import {
  getSprints, getVelocityTrend, getTasks, getTeamLoad, getHealthScore, getPlannedVsDone,
} from "@/lib/db";

// GET /api/teams-query?type=summary|sprint|tasks|team
// Returns an HTML acknowledgement page and posts a live data card to Teams.
export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type") ?? "summary";

  if (!isTeamsConfigured()) {
    return new Response(html("⚠ Teams webhook not configured", "Add TEAMS_WEBHOOK_URL to .env.local"), {
      status: 503,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  let card;
  switch (type) {
    case "sprint": {
      const [sprints, velocity] = await Promise.all([getSprints(), getVelocityTrend()]);
      const active = sprints[sprints.length - 1];
      card = buildCard({
        title: "📅 Sprint Durumu",
        text: `Aktif sprint: ${active?.name ?? "—"}`,
        color: "accent",
        facts: velocity.map((v) => ({ title: v.sprint, value: `${v.velocity} SP` })),
      });
      break;
    }
    case "tasks": {
      const tasks = await getTasks();
      const passing = tasks.filter((t) => t.passes).length;
      card = buildCard({
        title: "📝 Backlog",
        text: `${tasks.length} task, ${passing} kalite kapısından geçti`,
        color: "good",
        facts: tasks.slice(0, 6).map((t) => ({ title: `${t.passes ? "✅" : "❌"} ${t.title}`, value: `AI: ${t.aiSP} SP` })),
      });
      break;
    }
    case "team": {
      const team = await getTeamLoad();
      card = buildCard({
        title: "👥 Takım Yükü",
        color: team.some((m) => m.load >= 80) ? "warning" : "good",
        facts: team.map((m) => ({ title: m.name, value: `${m.load}% load` })),
      });
      break;
    }
    case "summary":
    default: {
      const [healthScore, plannedVsDone] = await Promise.all([getHealthScore(), getPlannedVsDone()]);
      const planned = plannedVsDone.reduce((s, r) => s + r.Planned, 0);
      const done = plannedVsDone.reduce((s, r) => s + r.Done, 0);
      card = buildCard({
        title: "🎯 Sprint Özeti",
        text: "aigle canlı durum raporu",
        color: healthScore >= 75 ? "good" : healthScore >= 50 ? "warning" : "attention",
        facts: [
          { title: "Health Score", value: `${healthScore} / 100` },
          { title: "Planlanan", value: `${planned} SP` },
          { title: "Tamamlanan", value: `${done} SP` },
          { title: "Tamamlama", value: planned > 0 ? `${Math.round((done / planned) * 100)}%` : "—" },
        ],
      });
    }
  }

  const result = await postToTeams(card);
  return new Response(
    html(
      result.ok ? "✅ Teams'e gönderildi" : "❌ Gönderilemedi",
      result.ok ? `<b>${type}</b> kartı kanala düştü.` : `Hata: ${result.error ?? "unknown"}`
    ),
    { status: result.ok ? 200 : 500, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

function html(title: string, body: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>
<style>body{font-family:system-ui;padding:48px;max-width:520px;margin:0 auto;background:#0a0a0a;color:#fff}
.card{border:1px solid #333;border-radius:12px;padding:32px;background:#171717}h1{margin:0 0 12px;font-size:24px}</style></head>
<body><div class="card"><h1>${title}</h1><div style="color:#a3a3a3">${body}</div></div></body></html>`;
}
