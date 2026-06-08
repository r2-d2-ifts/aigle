# Architecture

## Overview

aigle is a single Next.js 15 (App Router) application with five external boundaries: **Jira REST** (read-only), **Supabase Postgres** (state), **Supabase Auth** (cookie sessions), **Groq LLM** (inference), and **Microsoft Teams Workflows** (Adaptive Card webhooks). All UI is server-rendered React with client islands for interactive screens. Streaming is used for AI endpoints that produce long-form output.

```
┌──────────────────────────────────────────────────────────────┐
│                        Browser                               │
│  /login    /  /planning  /breakdown  /review  /risk          │
└───────────────┬──────────────────────────────────────────────┘
                │ fetch / SSE
┌───────────────▼──────────────────────────────────────────────┐
│      middleware.ts — Supabase Auth gate (cookie session)     │
│      public: /login, /api/auth, /api/teams-*                 │
├──────────────────────────────────────────────────────────────┤
│                Next.js App Router (server)                   │
│  app/api/auth/*    ←  signOut                                │
│  app/api/data/*    ←  read state from Postgres               │
│  app/api/jira/*    ←  read Jira, wipe + load Postgres        │
│  app/api/seed      ←  demo seed (wipe + load)                │
│  app/api/sprint/*  ←  mutate sprint                          │
│  app/api/ai/*      ←  Groq calls (streaming where useful)    │
│  app/api/risk/*    ←  butterfly simulation                   │
│  app/api/teams-*   ←  Adaptive Card push + query callbacks   │
└──┬───────────┬──────────┬─────────────┬──────────────┬───────┘
   │           │          │             │              │
   ▼           ▼          ▼             ▼              ▼
Supabase   Supabase    Jira REST      Groq         MS Teams
Postgres     Auth         v2          llama-3.3    Workflows
(state)    (sessions)               -70b-versatile  webhook
```

## Module Map

| Path | Responsibility |
|------|----------------|
| `app/(routes)/`            | Page components — one per screen |
| `app/api/data/*`           | Read endpoints (dashboard, health, planning, breakdown) |
| `app/api/jira/*`           | Jira read + import-to-Postgres |
| `app/api/ai/*`             | LLM-backed endpoints (sizing, breakdown, assignment, review, roast, blocker-risk) |
| `app/api/risk/butterfly`   | Pure-compute downstream impact |
| `app/api/sprint/add`       | Add task to active sprint |
| `app/api/seed`             | Wipe + load demo data |
| `components/screens/*`     | One screen per file — composes UI primitives |
| `components/ui/*`          | shadcn/ui primitives |
| `lib/db.ts`                | Postgres queries (read/write through service-role client) |
| `lib/supabase.ts`          | Supabase client factories |
| `lib/jiraClient.ts`        | Jira REST wrapper |
| `lib/wipe.ts`              | Idempotent wipe for seed + Jira import |
| `lib/seedData.mjs`         | Static team + backlog seed |
| `lib/mockData.ts`          | Fallback when Jira unavailable |
| `lib/types.ts`             | Shared TS types (Sprint, BacklogTask, Subtask, …) |
| `supabase/schema.sql`      | DDL — apply once on a fresh project |
| `scripts/seed.mjs`         | Standalone CLI seeder |

## Data Flow

### 1. Hydration

```
seed | jira/import → wipe.ts → db.ts → Supabase (tasks, sprints, team, history)
```

Both seed and Jira import are **wipe-then-load**: a clean slate every time, so the demo state is deterministic.

### 2. Read Path

```
Screen → fetch /api/data/* → lib/db.ts → supabase → JSON → React state
```

### 3. AI Path

```
Screen → POST /api/ai/<feature>
                 ↓
           Groq client (groq-sdk)
                 ↓
       JSON object response or
       Server-Sent Events stream (for breakdown, review)
                 ↓
           Screen renders
```

All AI routes:
- Use `llama-3.3-70b-versatile` (single model, switchable in one place per route)
- Return safe empty defaults when `GROQ_API_KEY` is missing — never crash the UI
- Use `response_format: { type: "json_object" }` when structured output is required
- Stream tokens for long-form outputs (`/api/ai/breakdown`, `/api/ai/review`)

### 4. Butterfly Effect

Pure compute against Postgres-stored task graph + history — no LLM call.

## Quality Gate ("Anti-Bullshit Filter")

`/api/ai/sizing` and `/api/ai/breakdown` enforce a quality check on incoming task descriptions before invoking the LLM. Tasks that fail the gate return `passes: false` with a `rejectReason` — the UI surfaces this instead of a useless estimate.

## State

- **Server state**: Supabase Postgres only. Schema in `supabase/schema.sql`.
- **Client state**: React local state. No global store; screens are largely independent.
- **Auth**: Supabase Auth (email/password) via `@supabase/ssr`. Cookie sessions, enforced by `middleware.ts`. `/login` is the only unauthenticated route. TopBar reacts to `onAuthStateChange` so logout/email updates without page reload. AppShell hides chrome (TopBar + Sidebar) on `/login` via `usePathname`.

## Teams Integration

Adaptive Card flow in two directions over a single `TEAMS_WEBHOOK_URL`:

- **App → Teams** — `lib/teams.ts` builds cards, `/api/teams-notify` POSTs them. UI exposes "Send to Teams" buttons (e.g. Review screen forwards the AI narrative).
- **Teams → App (live)** — `scripts/post-control-panel.mjs` posts a sticky panel whose buttons hit `/api/teams-query?type=…`, which returns an HTML ack and pushes a fresh data card back to the channel.
- **Teams → App (Power Automate)** — `scripts/generate-pa-cards.mjs` emits static card JSONs for PA flows that branch on `/komut` messages.

## Streaming

Two endpoints stream:
- `/api/ai/breakdown` — sub-tasks arrive incrementally
- `/api/ai/review` — Turkish narrative renders as it's generated

Both use the Groq SDK's `stream: true` mode and forward the response body directly to the client. The client uses `fetch` + a `ReadableStream` reader, not EventSource.

## Failure Modes

| Failure | Behavior |
|---------|----------|
| `GROQ_API_KEY` missing | AI routes return empty defaults; UI shows "AI disabled" |
| Jira unreachable / 401 | Jira import surfaces error; reads serve Supabase state |
| Supabase down | Read endpoints return 500; UI shows error toast |
| LLM returns invalid JSON | Server returns 500; client retries once |
| `TEAMS_WEBHOOK_URL` missing | `/api/teams-*` return 503; UI shows "Teams not configured" toast |
| Supabase Auth session expired | `middleware.ts` redirects to `/login?next=<path>` |

## Conventions

- **Server-only secrets** — anything not prefixed `NEXT_PUBLIC_` stays server-side.
- **SSL bypass** — `NODE_TLS_REJECT_UNAUTHORIZED=0` is set in `npm run dev` only, for the corporate Jira cert. Do not ship to production.
- **Wipe-then-load** — every import resets state. No partial merges.
- **No write to Jira** — hard constraint. The Jira client has no PUT/POST methods exposed.
