# aigle

## What This Is

aigle is an AI-powered Agile Manager that reads Jira (read-only) and automates the cognitive overhead of Scrum ceremonies. It provides predictive story point estimation with quality gating, automatic task decomposition with skill-based assignment, sprint dashboards, AI-generated review narratives, and a blocker impact simulator — freeing development teams to focus on coding instead of process management.

Built for the IFTS AI Hackathon 2026 as a Next.js 15 + Groq LLM application backed by Supabase (Postgres + Auth) with Microsoft Teams Adaptive Card integration.

## Core Value

AI replaces the Scrum Master's cognitive load: quality gate → predictive sizing → decomposition → contextual assignment → review narrative — all explainable, all from Jira data.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] System reads backlog and sprint data from Jira via REST API (read-only)
- [ ] AI suggests story points with confidence score and reference count
- [ ] Anti-Bullshit Filter blocks sizing for insufficiently described tasks
- [ ] AI decomposes tasks into typed sub-tasks (FE/BE/DB/Test) with point estimates
- [ ] Smart assignment based on skill matrix + sprint load + domain history
- [ ] Sprint dashboard: velocity trend, planned vs done, spillover %
- [ ] AI-generated sprint review narrative (Turkish)
- [ ] "Roast My Sprint" humorous AI critique
- [ ] Butterfly Effect simulator: downstream impact when task is blocked
- [ ] Sprint Health Score (1–100) with factor breakdown

### Validated (post-hackathon additions)

- ✓ Supabase Postgres state — replaced in-memory mock
- ✓ Supabase Auth (email/password) — middleware-enforced session
- ✓ Groq llama-3.3-70b-versatile — replaced Claude
- ✓ Microsoft Teams Workflows integration — Adaptive Cards both directions
- ✓ Blocker Risk AI — predicts probability + causes + mitigations

### Out of Scope

- Jira write-back — hackathon constraint; demo safety
- Multi-team / multi-project — MVP focus
- Real-time WebSocket — polling or on-demand sufficient
- Role-based access control — auth is binary (signed-in or not)

## Context

- Hackathon: IFTS AI 2026, ~4 hour build window
- Jira instance: `JIRA_SERVER` env var (Turkcell internal), project `TUDS`
- Credentials: `JIRA_LOGIN` + `JIRA_API_TOKEN` env vars
- UI: Generated from Figma Make, converted from Vite SPA to Next.js 15 App Router
- LLM: Anthropic Claude API (`@anthropic-ai/sdk`)
- Stack: Next.js 15 + Tailwind v4 + shadcn/ui + Recharts
- Mock data exists for all features (graceful fallback if Jira unavailable)

## Constraints

- **Timeline**: 4-hour hackathon — MVP focus, no gold-plating
- **Jira**: Read-only — no write operations whatsoever
- **Data**: In-memory + JSON — no persistent database
- **Auth**: None — single-user demo tool
- **Language**: UI in English, AI-generated content in Turkish

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js 15 App Router over Vite SPA | SSR capability, API routes, Next.js ecosystem — no separate backend needed | — Pending |
| Anthropic Claude over OpenAI | Claude API access configured, hackathon context | — Pending |
| All-in-one Next.js (no FastAPI) | Saves setup time; API routes sufficient for hackathon MVP | — Pending |
| Mock data fallback | Demo must work even if Jira is unavailable on presentation day | — Pending |
| Tailwind v4 + shadcn/ui | Already in codebase from Figma Make; no migration cost | — Pending |

---

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-08 after initialization*
