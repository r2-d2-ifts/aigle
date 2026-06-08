# ROADMAP: AgileMind AI

**Project:** AgileMind AI — AI-powered Agile Manager (IFTS Hackathon 2026)
**Granularity:** Coarse (3 phases)
**Coverage:** 21/21 v1 requirements mapped
**Created:** 2026-06-08

---

## Phases

- [x] **Phase 1: Foundation + Jira Integration** - Working Next.js app with Supabase data layer, Jira import + seed buttons
- [x] **Phase 2: AI Core** - All AI features operational: quality gate, estimation, streaming decomposition, smart assignment
- [x] **Phase 3: Dashboard + Review + Bonus Features** - Full demo-ready: metrics wired, streaming Turkish review, Roast, Butterfly Effect, Health Score

---

## Phase Details

### Phase 1: Foundation + Jira Integration
**Goal**: Real Jira data flows through every screen — backlog items, sprint history, and status transitions — with graceful mock fallback when Jira is unavailable
**Depends on**: Nothing (first phase)
**Requirements**: JIRA-01, JIRA-02, JIRA-03, ASGN-01
**Success Criteria** (what must be TRUE):
  1. Backlog screen shows real stories and bugs pulled from the configured Jira project
  2. Sprint history reflects actual Jira sprint data (or clearly labeled mock data when offline)
  3. Task status transitions including blocked events are available to downstream AI features
  4. Team member roster with skills and sprint load is loaded from static JSON and visible in the UI
**Plans**: TBD
**UI hint**: yes

### Phase 2: AI Core
**Goal**: All AI features are wired and producing real Claude API responses — story point estimation with quality gating, task decomposition into typed sub-tasks, and explainable smart assignment
**Depends on**: Phase 1
**Requirements**: SIZE-01, SIZE-02, SIZE-03, SIZE-04, DECO-01, DECO-02, DECO-03, ASGN-02, ASGN-03
**Success Criteria** (what must be TRUE):
  1. Selecting a task triggers Claude to return a story point estimate with confidence percentage and reference task count
  2. Submitting a poorly-described task returns a rejection with the specific quality criteria that failed (not a generic error)
  3. Triggering decomposition on a task produces FE, BE, DB, and Test sub-tasks each with a name, description, estimated points, and dependencies
  4. Each sub-task shows an assignment recommendation with an explainable reason citing skill match, current load, and domain history
  5. Assignment scores weight the team member's past performance in the same technical domain
**Plans**: TBD

### Phase 3: Dashboard + Review + Bonus Features
**Goal**: The product is demo-ready — all sprint metrics are wired, the AI review narrative streams in Turkish, Roast My Sprint delivers humorous critique, the Butterfly Effect simulator shows blocker cascades, and the Health Score quantifies sprint health
**Depends on**: Phase 2
**Requirements**: DASH-01, DASH-02, DASH-03, DASH-04, DASH-05, RISK-01, RISK-02, RISK-03
**Success Criteria** (what must be TRUE):
  1. Dashboard displays a velocity trend line chart and a planned-vs-completed bar chart broken down by Stories, Bugs, and Tech Debt
  2. Spillover rate (percentage and count) is visible on the dashboard
  3. AI generates a Turkish-language sprint review narrative covering completed work, deviations, and spillover causes
  4. "Roast My Sprint" produces a data-driven humorous critique distinct from the review narrative
  5. Selecting a blocked task in the Butterfly Effect simulator shows affected downstream tasks, risk probability, expected delay in days, and a mitigation suggestion
  6. Sprint Health Score (1–100) is displayed with its factor breakdown (velocity fit, spillover rate, blocked count, overcommit ratio)
**Plans**: TBD
**UI hint**: yes

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation + Jira Integration | ✓ | Complete | 2026-06-08 |
| 2. AI Core | ✓ | Complete | 2026-06-08 |
| 3. Dashboard + Review + Bonus Features | ✓ | Complete | 2026-06-08 |

---

## Coverage Map

| Requirement | Phase |
|-------------|-------|
| JIRA-01 | Phase 1 |
| JIRA-02 | Phase 1 |
| JIRA-03 | Phase 1 |
| ASGN-01 | Phase 1 |
| SIZE-01 | Phase 2 |
| SIZE-02 | Phase 2 |
| SIZE-03 | Phase 2 |
| SIZE-04 | Phase 2 |
| DECO-01 | Phase 2 |
| DECO-02 | Phase 2 |
| DECO-03 | Phase 2 |
| ASGN-02 | Phase 2 |
| ASGN-03 | Phase 2 |
| DASH-01 | Phase 3 |
| DASH-02 | Phase 3 |
| DASH-03 | Phase 3 |
| DASH-04 | Phase 3 |
| DASH-05 | Phase 3 |
| RISK-01 | Phase 3 |
| RISK-02 | Phase 3 |
| RISK-03 | Phase 3 |

**v1 mapped: 21/21** ✓

---
*Created: 2026-06-08*
