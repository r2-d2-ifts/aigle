# Architecture

## Overview

aigle is a single Next.js 15 (App Router) application with three external boundaries: **Jira REST** (read-only), **Supabase Postgres** (state), and **Groq LLM** (inference). All UI is server-rendered React with client islands for interactive screens. Streaming is used for AI endpoints that produce long-form output.

```
┌──────────────────────────────────────────────────────────────┐
│                        Browser                               │
│  /planning  /breakdown  /review  /risk  /  (Dashboard)       │
└───────────────┬──────────────────────────────────────────────┘
                │ fetch / SSE
┌───────────────▼──────────────────────────────────────────────┐
│                Next.js App Router (server)                   │
│  app/api/data/*    ←  read state from Postgres               │
│  app/api/jira/*    ←  read Jira, wipe + load Postgres        │
│  app/api/seed      ←  demo seed (wipe + load)                │
│  app/api/sprint/*  ←  mutate sprint                          │
│  app/api/ai/*      ←  Groq calls (streaming where useful)    │
│  app/api/risk/*    ←  butterfly simulation                   │
└──────┬────────────────────────┬─────────────────┬────────────┘
       │                        │                 │
       ▼                        ▼                 ▼
   Supabase                Jira REST            Groq
   Postgres                  v2                 llama-3.3-70b-versatile
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
- **No auth**: single-user demo tool.

## Streaming

Two endpoints stream:
- `/api/ai/breakdown` — sub-tasks arrive incrementally
- `/api/ai/review` — Turkish narrative renders as it's generated

Both use the Groq SDK's `stream: true` mode and forward the response body directly to the client. The client uses `fetch` + a `ReadableStream` reader, not EventSource.

## Failure Modes

| Failure | Behavior |
|---------|----------|
| `GROQ_API_KEY` missing | AI routes return empty defaults; UI shows "AI disabled" |
| Jira unreachable / 401 | Falls back to `lib/mockData.ts` so the demo always works |
| Supabase down | Read endpoints return 500; UI shows error toast |
| LLM returns invalid JSON | Server returns 500; client retries once |

## Conventions

- **Server-only secrets** — anything not prefixed `NEXT_PUBLIC_` stays server-side.
- **SSL bypass** — `NODE_TLS_REJECT_UNAUTHORIZED=0` is set in `npm run dev` only, for the corporate Jira cert. Do not ship to production.
- **Wipe-then-load** — every import resets state. No partial merges.
- **No write to Jira** — hard constraint. The Jira client has no PUT/POST methods exposed.
