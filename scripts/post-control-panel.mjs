// Posts a sticky "Control Panel" Adaptive Card to Teams. Buttons link to the
// running Next.js app's /api/teams-query endpoint, which returns an ack page
// AND posts a fresh live-data card back to the same Teams channel.
//
// Usage:
//   PUBLIC_BASE_URL=https://abc123.ngrok.io node scripts/post-control-panel.mjs
//   node scripts/post-control-panel.mjs https://abc123.ngrok.io

const webhook = process.env.TEAMS_WEBHOOK_URL;
const baseUrl = process.argv[2] || process.env.PUBLIC_BASE_URL || "http://localhost:3000";

if (!webhook) { console.error("Missing TEAMS_WEBHOOK_URL"); process.exit(1); }

const card = {
  type: "message",
  attachments: [
    {
      contentType: "application/vnd.microsoft.card.adaptive",
      content: {
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
        type: "AdaptiveCard",
        version: "1.4",
        body: [
          { type: "TextBlock", text: "🎛 aigle Kontrol Paneli", weight: "Bolder", size: "Large", color: "Accent" },
          { type: "TextBlock", text: "Aşağıdaki butonlardan birine tıklayarak aigle kanalına anlık veri raporu gönder:", wrap: true, isSubtle: true },
        ],
        actions: [
          { type: "Action.OpenUrl", title: "📊 Proje Özeti",   url: `${baseUrl}/api/teams-query?type=summary` },
          { type: "Action.OpenUrl", title: "📋 Görev Listesi", url: `${baseUrl}/api/teams-query?type=tasks` },
          { type: "Action.OpenUrl", title: "🏃 Sprint Özeti",  url: `${baseUrl}/api/teams-query?type=sprint` },
          { type: "Action.OpenUrl", title: "👥 Takım Durumu",  url: `${baseUrl}/api/teams-query?type=team` },
        ],
      },
    },
  ],
};

const res = await fetch(webhook, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(card),
});

console.log(`Status: ${res.status}`);
if (!res.ok) console.error(await res.text());
else console.log(`✓ Control Panel posted (baseUrl=${baseUrl})`);
