# Development Phases

Project followed a 3-phase, coarse-grain roadmap (see `.planning/ROADMAP.md` for the GSD source of truth).

> All three phases were completed on **2026-06-08** during the IFTS AI Hackathon 2026.

---

## Phase 1 — Foundation + Jira Integration

**Goal:** Real Jira data flows through every screen — backlog items, sprint history, and status transitions — with graceful mock fallback when Jira is unavailable.

**Requirements covered:** `JIRA-01`, `JIRA-02`, `JIRA-03`, `ASGN-01`

**Delivered:**
- Next.js 15 App Router scaffold with shadcn/ui + Tailwind 4
- Supabase schema (`supabase/schema.sql`) + `lib/db.ts` query layer
- `lib/jiraClient.ts` — read-only Jira REST v2 wrapper
- `/api/jira/backlog`, `/api/jira/sprints`, `/api/jira/import` endpoints
- Wipe-then-load discipline (`lib/wipe.ts`) so seed/import are idempotent
- Static team roster with skills + load (4-person team, Turkcell emails)
- Mock fallback (`lib/mockData.ts`) when Jira is offline or auth fails

**Success criteria met:**
1. Backlog screen shows real stories and bugs from configured Jira project
2. Sprint history reflects actual Jira sprint data (or labeled mock data)
3. Task status transitions including blocked events are exposed to downstream AI
4. Team roster loads from static JSON and is visible in the UI

---

## Phase 2 — AI Core

**Goal:** All AI features wired and producing real LLM responses — predictive story-point estimation with quality gating, task decomposition into typed sub-tasks, and explainable smart assignment.

**Requirements covered:** `SIZE-01`–`SIZE-04`, `DECO-01`–`DECO-03`, `ASGN-02`, `ASGN-03`

**Delivered:**
- Groq SDK integration with `llama-3.3-70b-versatile`
- `/api/ai/sizing` — story points + confidence + reference count
- Anti-Bullshit Filter — rejects underspecified tasks before sizing
- `/api/ai/breakdown` — streaming FE/BE/DB/Test sub-tasks with point estimates
- `/api/ai/assignment` — explainable recommendation citing skill match, load, domain history

**Success criteria met:**
1. Task selection triggers AI sizing with confidence % + reference count
2. Poorly-described tasks return rejection with specific failed quality criteria
3. Decomposition produces FE/BE/DB/Test sub-tasks each with name, description, points, dependencies
4. Each sub-task includes an assignment recommendation with explainable reason
5. Assignment scoring weights past performance in the same technical domain

---

## Phase 3 — Dashboard + Review + Bonus Features

**Goal:** Product is demo-ready — sprint metrics wired, Turkish review narrative streams, Roast My Sprint delivers humorous critique, Butterfly Effect simulates blocker cascades, Health Score quantifies sprint health.

**Requirements covered:** `DASH-01`–`DASH-05`, `RISK-01`–`RISK-03`

**Delivered:**
- `/api/data/dashboard` + `components/screens/DashboardScreen.tsx` — velocity trend (line), planned-vs-completed (bar), stories/bugs/tech-debt breakdown
- Spillover rate (% + count) on dashboard
- `/api/ai/review` — streaming Turkish sprint narrative
- `/api/ai/roast` — humorous critique (distinct prompt from review)
- `/api/risk/butterfly` — downstream impact, risk probability, expected delay, mitigation suggestion
- `/api/ai/blocker-risk` — pattern-based blocker risk per task
- `/api/data/health` + `components/HealthScoreGauge.tsx` — sprint health 1–100 with factor breakdown
- Confetti polish via `canvas-confetti`

**Success criteria met:**
1. Dashboard shows velocity trend line + planned-vs-completed bar (Stories/Bugs/Tech Debt)
2. Spillover rate visible
3. AI generates Turkish review narrative covering completed work, deviations, spillover causes
4. "Roast My Sprint" produces distinct humorous critique
5. Butterfly Effect simulator shows affected downstream tasks + risk + delay + mitigation
6. Sprint Health Score (1–100) displayed with factor breakdown (velocity fit, spillover rate, blocked count, overcommit ratio)

---

## Out of Scope (Not Built)

- Jira write-back (hard constraint)
- Multi-team / multi-project
- User authentication
- Real-time WebSocket
- Production database hardening (this is a demo)
