# aigle

> AI-powered Agile Manager that reads Jira (read-only) and automates the cognitive overhead of Scrum ceremonies — predictive sizing, task decomposition, smart assignment, sprint review narratives, blocker impact simulation, and sprint health scoring.

Built for the **IFTS AI Hackathon 2026**.

---

## What It Does

aigle replaces a Scrum Master's manual workload with explainable AI:

- **Predictive Sizing** — story points with confidence % and reference task count
- **Anti-Bullshit Filter** — quality gate that rejects insufficiently described tasks before sizing
- **Task Decomposition** — automatic FE / BE / DB / Test sub-tasks with point estimates
- **Smart Assignment** — recommendations citing skill match, current sprint load, and domain history
- **Sprint Dashboard** — velocity trend, planned-vs-completed, spillover %, sprint health 1–100
- **AI Sprint Review** — streaming Turkish narrative of completed work, deviations, spillover causes
- **Roast My Sprint** — data-driven humorous critique
- **Butterfly Effect Simulator** — downstream impact when a task is blocked
- **Blocker Risk Analysis** — historical patterns to flag at-risk tasks

> Jira is read-only. No writes happen against your Jira instance.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) + React 18 + TypeScript |
| UI | shadcn/ui + Radix UI + Tailwind CSS 4 + MUI icons + lucide-react |
| Charts | Recharts |
| Animation | motion + canvas-confetti |
| LLM | Groq SDK — `llama-3.3-70b-versatile` (streaming) |
| Data | Supabase (Postgres) via `@supabase/supabase-js` |
| Auth | Supabase Auth via `@supabase/ssr` (cookie sessions, middleware-guarded routes) |
| Integration | Jira REST API v2 (read-only), Microsoft Teams Workflows (Adaptive Cards) |

---

## Getting Started

### Prerequisites

- Node.js 20+ (see `.nvmrc`)
- A Groq API key — https://console.groq.com/keys
- A Supabase project (or any Postgres + the schema in `supabase/schema.sql`)
- (Optional) Jira instance with a PAT for read-only access — the app falls back to seed data when Jira is unavailable

### Install & Run

```bash
cp .env.example .env.local
# fill in GROQ_API_KEY, SUPABASE_*, JIRA_* values

npm install
npm run dev
```

Open http://localhost:3000.

### Seed Data

The Planning screen has two buttons:
- **Seed** — loads a 4-person team + sample backlog into Supabase (wipe-then-load)
- **Import from Jira** — pulls current sprint + backlog from your configured Jira project (wipe-then-load)

Pure script alternative:

```bash
node scripts/seed.mjs
```

### Database Schema

Apply `supabase/schema.sql` once on a fresh Supabase project (SQL editor → run).

---

## Environment Variables

See [`.env.example`](./.env.example) for the full list. Required at minimum:

| Variable | Purpose |
|----------|---------|
| `GROQ_API_KEY` | LLM calls (sizing, breakdown, assignment, review, roast, butterfly, blocker-risk) |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + server Supabase access |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side mutations (seed, Jira import, user admin) |
| `JIRA_SERVER`, `JIRA_LOGIN`, `JIRA_API_TOKEN`, `JIRA_PROJECT` | Optional — enables real Jira import |
| `TEAMS_WEBHOOK_URL` | Optional — Microsoft Teams Workflows incoming webhook for sharing review/roast/dashboard cards |

Without `GROQ_API_KEY`, AI routes return empty/safe defaults instead of crashing.
Without `TEAMS_WEBHOOK_URL`, the "Send to Teams" button returns HTTP 503 with a clear toast.

---

## Application Routes

| Route | Screen |
|-------|--------|
| `/` | Dashboard — velocity, spillover, sprint health |
| `/planning` | Sprint planning — backlog, sizing, quality gate, blocker risk |
| `/breakdown` | Task decomposition + smart assignment |
| `/review` | AI sprint review narrative + Roast + Send to Teams |
| `/risk` | Butterfly Effect blocker simulator |
| `/login` | Sign-in / Sign-up (Supabase Auth) — chrome hidden here |

All routes except `/login`, `/api/auth/*`, and `/api/teams-*` require an authenticated session (enforced by `middleware.ts`).

## API Routes

All under `app/api/`:

| Method | Path | Purpose |
|--------|------|---------|
| GET    | `/api/data/dashboard` | Sprint metrics |
| GET    | `/api/data/health` | Sprint health score breakdown |
| GET    | `/api/data/planning` | Planning board state |
| GET    | `/api/data/breakdown` | Breakdown board state |
| GET    | `/api/jira/backlog` | Read backlog from Jira |
| GET    | `/api/jira/sprints` | Read sprints from Jira |
| POST   | `/api/jira/import` | Wipe + import current Jira sprint |
| POST   | `/api/seed` | Wipe + load demo seed |
| POST   | `/api/sprint/add` | Add task to active sprint |
| POST   | `/api/ai/sizing` | Predictive story points |
| POST   | `/api/ai/breakdown` | Decompose task → sub-tasks (streaming) |
| POST   | `/api/ai/assignment` | Smart assignee recommendation |
| POST   | `/api/ai/review` | Sprint review narrative (streaming, Turkish) |
| POST   | `/api/ai/roast` | Roast My Sprint critique |
| POST   | `/api/ai/blocker-risk` | Blocker risk prediction |
| POST   | `/api/risk/butterfly` | Downstream impact simulation |
| POST   | `/api/auth/logout` | Server-side session signOut |
| POST   | `/api/teams-notify` | Send any Adaptive Card to Teams webhook |
| GET    | `/api/teams-query` | Teams button callback → live data card |

## Authentication

Supabase Auth (email + password) via `@supabase/ssr` cookie sessions.

```bash
# Pre-confirmed accounts for the 4 team members
npm run create-users
# Default password: Test1234
```

`/login` is the only unauthenticated route. `middleware.ts` redirects everything else (except `/api/auth/*` and `/api/teams-*`) to `/login?next=<path>` when no session is present.

## Microsoft Teams Integration

Adaptive Cards in both directions via a Teams Workflows incoming webhook. See [`docs/teams-integration.md`](./docs/teams-integration.md).

```bash
npm run teams:test                                 # smoke test → HTTP 202
npm run teams:panel https://your-tunnel.ngrok.io   # post sticky control panel
npm run pa-cards                                   # generate Power Automate cards
```

---

## AI Tooling Used During Development

This project was built with heavy use of AI coding tools. See [`docs/AI-AGENTS.md`](./docs/AI-AGENTS.md) for the full breakdown.

| Tool | Role |
|------|------|
| **Claude Code** (Opus 4.7, 1M context) | Primary code-gen, refactoring, planning |
| **Groq llama-3.3-70b-versatile** | Runtime LLM behind every `/api/ai/*` route |
| **Figma Make / Figma MCP** | Initial UI scaffolding from `wRPCHutX4rq9ffrzrHHTlA` |
| **GSD workflow** (`.planning/`) | Roadmap → phase → plan → execute discipline |

### Project-Checked AI Config Files

| File | Purpose |
|------|---------|
| [`.mcp.json`](./.mcp.json) | MCP server registrations |
| [`.claude/settings.json`](./.claude/settings.json) | Claude Code project settings + enabled plugins |
| [`.claude/agents/`](./.claude/agents) | Custom subagents (nextjs, typescript-pro, debugger, test-engineer, …) |
| [`.claude/skills/`](./.claude/skills) | Skill bundles (frontend-design, mcp-integration, …) |
| [`.claude/hooks/test-runner.sh`](./.claude/hooks/test-runner.sh) | PostToolUse Edit hook |
| [`.planning/`](./.planning) | PROJECT.md, REQUIREMENTS.md, ROADMAP.md, STATE.md (GSD artifacts) |
| [`docs/spec-merged.md`](./docs/spec-merged.md) | Canonical product spec fed to AI |

### MCP Servers Wired In

From [`.mcp.json`](./.mcp.json):

| Server | Purpose |
|--------|---------|
| `DeepGraph Next.js MCP` | Code-graph queries against `vercel/next.js` |
| `context7` | Up-to-date library docs (Next.js, Supabase, Tailwind, …) |
| `postgresql` | Direct Postgres inspection during dev |

---

## Project Structure

```
aigle/
├── app/                    # Next.js App Router — pages + API routes
│   ├── api/                # AI + data + jira + seed endpoints
│   ├── planning/           # Sprint planning screen
│   ├── breakdown/          # Task decomposition screen
│   ├── review/             # Sprint review screen
│   └── risk/               # Butterfly Effect simulator
├── components/             # Reusable UI + screen components
│   └── screens/            # PlanningScreen, BreakdownScreen, ReviewScreen, …
├── lib/                    # db, jiraClient, supabase, types, utils
├── hooks/                  # React hooks
├── supabase/schema.sql     # Database schema
├── scripts/seed.mjs        # Standalone seeder
├── docs/                   # Specs + architecture + phases
├── .planning/              # GSD: PROJECT, REQUIREMENTS, ROADMAP, STATE
├── .claude/                # Claude Code agents, skills, hooks, settings
└── .mcp.json               # MCP server registrations
```

---

## Documentation

| File | Contents |
|------|----------|
| [`docs/spec-merged.md`](./docs/spec-merged.md) | Full canonical feature spec |
| [`docs/requirements.md`](./docs/requirements.md) | Functional requirements list |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Modules, data flow, AI pipeline |
| [`docs/PHASES.md`](./docs/PHASES.md) | Development phases (P1 → P3) |
| [`docs/AI-AGENTS.md`](./docs/AI-AGENTS.md) | AI tools, agents, prompts, models |
| [`docs/UI-SPEC.md`](./docs/UI-SPEC.md) | Screen-by-screen UI contract |

---

## Screenshots

Place PNGs under `docs/screenshots/` and they will render below.

| Screen | Image |
|--------|-------|
| Dashboard | `docs/screenshots/dashboard.png` |
| Planning  | `docs/screenshots/planning.png` |
| Breakdown | `docs/screenshots/breakdown.png` |
| Review    | `docs/screenshots/review.png` |
| Risk      | `docs/screenshots/risk.png` |

---

## Deployment

**Live Demo:** _TBD — paste production URL here after `vercel deploy --prod`_

Recommended target: Vercel.

```bash
vercel link
vercel env pull .env.local   # or set the keys in the dashboard
vercel deploy --prod
```

Build command: `next build`. Output: standard Next.js (server-rendered, no static export).

---

## Attributions

See [`ATTRIBUTIONS.md`](./ATTRIBUTIONS.md). UI scaffold derived from a Figma Make file using shadcn/ui (MIT) and Unsplash imagery.

---

## License

Hackathon project — internal demo. Not licensed for redistribution.
