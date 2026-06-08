// Adaptive Card helpers for Microsoft Teams Workflows incoming webhook.

const WEBHOOK = process.env.TEAMS_WEBHOOK_URL;

export type Fact = { title: string; value: string };

export function buildCard(opts: {
  title: string;
  text?: string;
  facts?: Fact[];
  actions?: { title: string; url: string }[];
  color?: "good" | "warning" | "attention" | "accent" | "default";
}) {
  const body: Record<string, unknown>[] = [
    {
      type: "TextBlock",
      text: opts.title,
      weight: "Bolder",
      size: "Large",
      color: opts.color === "good" ? "Good" : opts.color === "warning" ? "Warning" : opts.color === "attention" ? "Attention" : opts.color === "accent" ? "Accent" : "Default",
      wrap: true,
    },
  ];
  if (opts.text) body.push({ type: "TextBlock", text: opts.text, wrap: true });
  if (opts.facts?.length) {
    body.push({ type: "FactSet", facts: opts.facts.map((f) => ({ title: f.title, value: f.value })) });
  }

  const actions = (opts.actions ?? []).map((a) => ({
    type: "Action.OpenUrl",
    title: a.title,
    url: a.url,
  }));

  return {
    type: "message",
    attachments: [
      {
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
          $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
          type: "AdaptiveCard",
          version: "1.4",
          body,
          ...(actions.length ? { actions } : {}),
        },
      },
    ],
  };
}

export async function postToTeams(card: object): Promise<{ ok: boolean; status: number; error?: string }> {
  if (!WEBHOOK) return { ok: false, status: 503, error: "TEAMS_WEBHOOK_URL not configured" };
  try {
    const res = await fetch(WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(card),
    });
    return { ok: res.ok, status: res.status, error: res.ok ? undefined : await res.text() };
  } catch (e) {
    return { ok: false, status: 0, error: String(e) };
  }
}

export function isTeamsConfigured() {
  return Boolean(WEBHOOK);
}
