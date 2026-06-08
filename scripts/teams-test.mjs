// Smoke test for TEAMS_WEBHOOK_URL. Expects HTTP 202.
const webhook = process.env.TEAMS_WEBHOOK_URL;
if (!webhook) { console.error("Missing TEAMS_WEBHOOK_URL"); process.exit(1); }

const card = {
  type: "message",
  attachments: [{
    contentType: "application/vnd.microsoft.card.adaptive",
    content: {
      $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
      type: "AdaptiveCard",
      version: "1.4",
      body: [
        { type: "TextBlock", text: "🦅 aigle smoke test", weight: "Bolder", size: "Large", color: "Accent" },
        { type: "TextBlock", text: `OK from ${new Date().toISOString()}`, isSubtle: true },
      ],
    },
  }],
};

const res = await fetch(webhook, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(card),
});
console.log(`Status: ${res.status}`);
if (!res.ok) { console.error(await res.text()); process.exit(1); }
console.log("✓ Card posted");
