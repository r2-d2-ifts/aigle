# aigle — UI Specification

**Project:** AI-Powered Agile Manager | Hackathon MVP  
**Stack hint:** Next.js 15 + Tailwind | Single-user demo tool

---

## Design Principles

- **Data-forward:** metrics are primary, labels are secondary
- **AI-visible:** AI decisions always show their reasoning inline
- **Demo-ready:** 6-step flow must be presentable in 3 minutes
- **Colors:** health score uses semantic gradient (green 75–100 / yellow 50–74 / red 0–49)
- **Language:** UI labels in English, AI-generated text in Turkish (bilingual ok)

---

## Global Layout

```
┌──────────────────────────────────────────────────────────────┐
│  aigle              Sprint: [selector ▾]   [⚙ Config] │
├────────────┬─────────────────────────────────────────────────┤
│            │                                                  │
│  Sidebar   │              Main Content                        │
│  Nav       │                                                  │
│            │                                                  │
└────────────┴─────────────────────────────────────────────────┘
```

**Sidebar nav items:**
1. Dashboard
2. Sprint Planning
3. Task Breakdown
4. Sprint Review
5. Health & Risk

---

## Screen 1 — Dashboard (Home)

**Route:** `/`

```
┌─────────────────────────────────────────────────────┐
│  Sprint: Sprint 14  ▾          [New Planning] [Roast]│
├──────────┬──────────┬──────────┬────────────────────┤
│ Velocity │ Done     │ Spillover│ Health Score        │
│  42 SP   │ 87%      │ 13%      │  ████████░░  78/100 │
│ ↑8 vs avg│ 21/24 SP │ 3 tasks  │  Status: Good      │
├──────────┴──────────┴──────────┴────────────────────┤
│  Velocity Trend (last 5 sprints — line chart)        │
│  Sprint 10  Sprint 11  Sprint 12  Sprint 13  Sprint 14│
│        34    38         40         34         42     │
└─────────────────────────────────────────────────────┘
```

**Components:**
- `SprintSelector` — dropdown, shows sprint name + date range
- `MetricCard` — icon + big number + delta vs average
- `HealthScoreBadge` — horizontal progress bar + number + status label (Good/Warning/Critical)
- `VelocityChart` — line chart, 5 sprints, Recharts `LineChart`
- `QuickAction` buttons — primary "New Planning", secondary "Roast This Sprint"

---

## Screen 2 — Sprint Planning

**Route:** `/planning`

```
┌─────────────────────────────────┬───────────────────┐
│  BACKLOG                        │  AI SIZING PANEL   │
│  [🔍 Search]  [Filter ▾]        │                    │
│                                 │  Selected Task:    │
│  ┌──────────────────────────┐   │  "User Login Page" │
│  │ 🐛 Login page broken ✅  │   │                    │
│  │  Current: ? SP           │   │  Suggested: 5 SP   │
│  │  AI: 5 SP  [Select]      │   │  Confidence: 82%   │
│  └──────────────────────────┘   │  References: 8     │
│                                 │                    │
│  ┌──────────────────────────┐   │  "Similar past     │
│  │ 📖 Add OAuth ❌          │   │  tasks averaged    │
│  │  Anti-Bullshit: Rejected │   │  4.8 SP"           │
│  │  "No acceptance criteria"│   │                    │
│  └──────────────────────────┘   │  [Add to Sprint]   │
│                                 │                    │
│  ┌──────────────────────────┐   └───────────────────┘
│  │ 📖 Dashboard refactor ✅ │
│  │  AI: 8 SP  [Select]     │
│  └──────────────────────────┘
└─────────────────────────────────┘
```

**Components:**
- `BacklogList` — scrollable task list with type icon (story 📖 / bug 🐛)
- `TaskCard` — title, type, current SP, AI suggestion badge, gate status icon
  - ✅ green = passes quality gate
  - ❌ red = Anti-Bullshit rejected (show reason on hover/expand)
- `AISizingPanel` — right sidebar, shows for selected task:
  - Suggested SP (large, prominent)
  - Confidence % (colored bar)
  - Reference count
  - Explainer quote
- `QualityGateAlert` — red inline message when task fails (shows missing criteria)

---

## Screen 3 — Task Breakdown

**Route:** `/breakdown`

```
┌─────────────────────────────────────────────────────┐
│  Task: "Implement Payment Flow"  [8 SP] [Decompose ▶]│
├──────────┬────────────────────┬───────┬─────────────┤
│  Type    │  Sub-task          │  SP   │  Assigned   │
├──────────┼────────────────────┼───────┼─────────────┤
│  🖥 FE   │  Payment UI form  │  2    │  Ayşe       │
│  ⚙ BE   │  Payment API       │  3    │  Mehmet     │
│  🗄 DB   │  Transactions table│  1    │  Mehmet     │
│  🧪 Test │  E2E payment flow  │  2    │  Can        │
├──────────┴────────────────────┴───────┴─────────────┤
│  ASSIGNMENT RATIONALE                                │
│  ┌───────────────────────────────────────────────┐  │
│  │ Ayşe → FE: 2 similar FE tasks last sprint,   │  │
│  │         load 40%, skill match: React ✓        │  │
│  │ Mehmet → BE+DB: ödeme modülü 3 sprint geçmiş │  │
│  │         load 55%, skill match: FastAPI ✓      │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Components:**
- `TaskHeader` — title, total SP, "Decompose" action button (triggers LLM stream)
- `SubtaskTable` — type icon, name, points, assigned person
  - Type badges: FE (blue), BE (green), DB (orange), Test (purple)
- `AssignmentRationale` — card per person or combined card showing AI reasoning
- `LoadBar` — shows current sprint load % per team member inline
- Streaming state: skeleton rows animate in as AI generates

---

## Screen 4 — Sprint Review Dashboard

**Route:** `/review`

```
┌─────────────────────────────────────────────────────┐
│  Sprint 14 Review                [Generate Review]   │
├──────────────────┬──────────────────────────────────┤
│  Planned vs Done │  Metric Cards Row                 │
│  [Bar Chart]     │  ┌────────┬────────┬────────┐    │
│                  │  │Velocity│Spillovr│Cycle T │    │
│  Plan: 24 SP     │  │ 42 SP  │ 13%    │ 2.3d   │    │
│  Done:  21 SP    │  └────────┴────────┴────────┘    │
│  Blocked: 2      │                                   │
├──────────────────┴──────────────────────────────────┤
│  AI REVIEW NARRATIVE                                 │
│  ┌────────────────────────────────────────────────┐ │
│  │ Sprint 14 boyunca 24 SP planlandı, 21 SP       │ │
│  │ tamamlandı. Sapmanın ana sebebi backend         │ │
│  │ bağımlılık gecikmesidir...                     │ │
│  └────────────────────────────────────────────────┘ │
│                     [Roast My Sprint 🔥]             │
└─────────────────────────────────────────────────────┘
```

**Components:**
- `PlannedVsDoneChart` — grouped bar chart (Planned / Done), Recharts `BarChart`
- `MetricCard` row — velocity, spillover %, avg cycle time, blocked count
- `ReviewNarrativePanel` — text area, initially empty, populated by AI
  - Shows loading skeleton while generating
  - "Copy" + "Export" buttons
- `RoastButton` — secondary CTA, red/fire icon, triggers alternate humorous narrative

---

## Screen 5 — Health & Risk (Butterfly Effect)

**Route:** `/risk`

```
┌─────────────────────────────────────────────────────┐
│  SPRINT HEALTH SCORE                                 │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │            78 / 100                          │   │
│  │  ████████████████████░░░░░  GOOD             │   │
│  ├────────────┬────────────────────────────────┤   │
│  │ Velocity   │ ██████████████  95%  ✓         │   │
│  │ Spillover  │ ████████░░░░░░  60%  ⚠          │   │
│  │ Blockers   │ ████████████░░  80%  ✓         │   │
│  │ Overcommit │ ████████████░░  80%  ✓         │   │
│  └────────────┴────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│  BUTTERFLY EFFECT SIMULATOR                          │
│  Block task: [Select task ▾]  [Simulate Impact ▶]   │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  🔴 DB schema task BLOCKED                   │   │
│  │      ↓                                       │   │
│  │  🟡 BE payment API  — risk 70%, +2 days      │   │
│  │      ↓                                       │   │
│  │  🟡 FE payment UI   — risk 40%, +3 days      │   │
│  │                                              │   │
│  │  Health Score: 78 → 61  (-17 points)         │   │
│  │  Mitigation: Parallelize FE with mock API    │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

**Components:**
- `HealthScoreGauge` — large ring or linear gauge, color-coded, 1–100
- `HealthFactorBreakdown` — table: factor name, bar, %, status icon
- `ButterflySimulator` — task selector + simulate button
- `ImpactTree` — vertical dependency chain with color dots (red = blocked, yellow = at risk)
- `ImpactSummary` — before/after health score delta, mitigation suggestion card

---

## Screen 6 — Roast My Sprint (Modal or Panel)

**Route:** modal overlay or `/review#roast`

```
┌────────────────────────────────────────────────┐
│  🔥 Roast My Sprint                    [Close] │
│                                                │
│  "Frontend 2 günde login'i bitirmiş, backend  │
│   1 haftadır şemada kaybolmuş. Bu tempoyla    │
│   release'i roadmap'e değil takvime yazmak    │
│   lazım. Tebrikler."                          │
│                                                │
│                              [Copy] [Share]    │
└────────────────────────────────────────────────┘
```

**Components:**
- `RoastModal` — dark background, fire emoji header, humorous AI text
- Action row: Copy to clipboard, Share (future)

---

## Component Inventory

| Component | Used In | Notes |
|-----------|---------|-------|
| `SprintSelector` | All screens | Dropdown, global |
| `MetricCard` | Dashboard, Review | Icon + number + delta |
| `HealthScoreBadge` | Dashboard, Health | Compact version |
| `HealthScoreGauge` | Health screen | Full version |
| `VelocityChart` | Dashboard | Recharts LineChart |
| `PlannedVsDoneChart` | Review | Recharts BarChart |
| `TaskCard` | Planning | Gate status + AI badge |
| `QualityGateAlert` | Planning | Inline rejection reason |
| `AISizingPanel` | Planning | Right panel |
| `SubtaskTable` | Breakdown | Type-colored badges |
| `AssignmentRationale` | Breakdown | AI explainability card |
| `LoadBar` | Breakdown | Per-person capacity |
| `ReviewNarrativePanel` | Review | AI text + copy |
| `RoastModal` | Review | Overlay |
| `ButterflySimulator` | Health | Task selector + trigger |
| `ImpactTree` | Health | Chain visualization |

---

## Navigation Flow (Demo Path)

```
Dashboard → Sprint Planning → Task Breakdown → Sprint Review → Health & Risk → Roast
```

---

*Last updated: 2026-06-08 — initial UI spec*
