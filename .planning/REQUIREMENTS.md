# Requirements: aigle

**Defined:** 2026-06-08
**Core Value:** AI replaces Scrum Master cognitive load — quality gate → sizing → decomposition → assignment → review, all explainable

---

## v1 Requirements

### Jira Integration (JIRA)

- [ ] **JIRA-01**: System reads backlog items (stories, bugs) from Jira REST API using configured credentials (read-only)
- [ ] **JIRA-02**: System reads sprint history including velocity data for the last 5 sprints
- [ ] **JIRA-03**: System reads task status transition history including blocked events

### Predictive Sizing (SIZE)

- [ ] **SIZE-01**: AI suggests story point estimate for a selected task with confidence percentage
- [ ] **SIZE-02**: AI shows count of similar reference tasks used in the estimation
- [ ] **SIZE-03**: Anti-Bullshit Filter blocks sizing when task description lacks required quality (problem clarity, acceptance criteria, platform)
- [ ] **SIZE-04**: System explains which specific quality criteria failed when a task is rejected by the gate

### Task Decomposition (DECO)

- [ ] **DECO-01**: User can trigger decomposition of a selected task into typed sub-tasks (FE, BE, DB, Test)
- [ ] **DECO-02**: Each generated sub-task includes name, description, estimated story points, and dependencies
- [ ] **DECO-03**: Sub-tasks are assigned to team members based on skill matrix and current sprint capacity

### Smart Assignment (ASGN)

- [ ] **ASGN-01**: Team member data (name, skills, current sprint load) loaded from static JSON configuration
- [ ] **ASGN-02**: AI shows an explainable reason for each assignment recommendation (skill match + load + history)
- [ ] **ASGN-03**: Assignment scoring weights past sprint performance in the same technical domain

### Dashboard & Review (DASH)

- [ ] **DASH-01**: Dashboard shows velocity trend line chart across the last 5 sprints
- [ ] **DASH-02**: Dashboard shows planned vs completed bar chart (broken down by Stories, Bugs, Tech Debt)
- [ ] **DASH-03**: Dashboard shows spillover rate percentage and count
- [ ] **DASH-04**: AI generates sprint review narrative covering completed work, deviations, and spillover causes
- [ ] **DASH-05**: "Roast My Sprint" generates humorous but data-driven sprint critique

### Risk & Health (RISK)

- [ ] **RISK-01**: Butterfly Effect simulator shows downstream task impact when a task is marked as blocked
- [ ] **RISK-02**: Blocker simulation output includes affected tasks, risk probability (%), expected delay (days), and mitigation suggestion
- [ ] **RISK-03**: Sprint Health Score (1–100) calculated from velocity fit, spillover rate, blocked task count, and overcommit ratio

---

## v2 Requirements

### Integrations

- **INT-01**: Jira write-back — create decomposed sub-tasks directly in Jira
- **INT-02**: Slack / Teams bot interface for sprint queries
- **INT-03**: Multi-team workspace support

### Advanced AI

- **AI-01**: Real-time blocker alerts via webhook monitoring
- **AI-02**: Sprint capacity forecasting across multiple upcoming sprints
- **AI-03**: Cross-sprint dependency tracking

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Jira write operations | Hackathon safety constraint; demo stability |
| User authentication | Single-user demo tool; no multi-user access needed |
| Persistent database | In-memory + JSON sufficient for MVP |
| Multi-project support | Out of MVP scope — single project focus |
| Real-time WebSocket | On-demand fetching sufficient for demo |
| Mobile responsive layout | Desktop demo tool |

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| JIRA-01 | Phase 1 | Pending |
| JIRA-02 | Phase 1 | Pending |
| JIRA-03 | Phase 1 | Pending |
| ASGN-01 | Phase 1 | Pending |
| SIZE-01 | Phase 2 | Pending |
| SIZE-02 | Phase 2 | Pending |
| SIZE-03 | Phase 2 | Pending |
| SIZE-04 | Phase 2 | Pending |
| DECO-01 | Phase 2 | Pending |
| DECO-02 | Phase 2 | Pending |
| DECO-03 | Phase 2 | Pending |
| ASGN-02 | Phase 2 | Pending |
| ASGN-03 | Phase 2 | Pending |
| DASH-01 | Phase 3 | Pending |
| DASH-02 | Phase 3 | Pending |
| DASH-03 | Phase 3 | Pending |
| DASH-04 | Phase 3 | Pending |
| DASH-05 | Phase 3 | Pending |
| RISK-01 | Phase 3 | Pending |
| RISK-02 | Phase 3 | Pending |
| RISK-03 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 21 total
- Mapped to phases: 21
- Unmapped: 0 ✓

---
*Requirements defined: 2026-06-08*
*Last updated: 2026-06-08 after initial definition*
