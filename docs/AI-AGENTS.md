# AI & Agents

How AI was used to **build** this project and how it runs **inside** the product.

---

## 1. Runtime AI — In the Product

All `/api/ai/*` routes call **Groq** with `llama-3.3-70b-versatile`. Switched from Anthropic Claude to Groq for hackathon speed (commit `a4c53f4`).

| Endpoint | Persona / Role | Streaming | Output |
|----------|----------------|-----------|--------|
| `/api/ai/sizing` | Estimator | no | `{ sp, confidence, references, rationale, passes, rejectReason }` |
| `/api/ai/breakdown` | Tech Lead | yes | `{ subtasks: [{ type, name, description, sp, assignee, dependencies }] }` |
| `/api/ai/assignment` | Engineering Manager | no | `{ assignee, reason, score }` |
| `/api/ai/review` | Scrum Master (Turkish) | yes | free-form narrative |
| `/api/ai/roast` | Stand-up comedian | no | short humorous critique |
| `/api/ai/blocker-risk` | Risk analyst | no | `{ riskScore, signals }` |

All routes:
- Pin the model in a single `MODEL` constant per file — easy to swap
- Return safe empty defaults when `GROQ_API_KEY` is missing — UI never crashes
- Use `response_format: { type: "json_object" }` for structured output
- Carry a short system prompt (persona) plus a user prompt with the task + context

### Quality Gate

Before sizing or breakdown, a quality check runs on the task title + description. If the description lacks enough signal (too short, no acceptance criteria, generic verbs), the gate returns `passes: false` with a `rejectReason` and the LLM is never called.

---

## 2. Build-Time AI — Tooling Used

### Claude Code (Anthropic)

- **Model:** Claude Opus 4.7 (1M context)
- **Surface:** Project-local `.claude/` directory checked into the repo
- **Settings:** `.claude/settings.json` — `PostToolUse:Edit` hook runs `test-runner.sh`; plugins enabled: `typescript-lsp`, `figma`, `superpowers`, `caveman`

#### Custom Subagents (`.claude/agents/`)

Domain-specialized agents the main thread dispatches to:

| Agent | When |
|-------|------|
| `backend-architect.md` | API/service design decisions |
| `nextjs-architecture-expert.md` | App Router, RSC, caching strategy |
| `nextjs-developer.md` | Full-stack Next.js implementation |
| `typescript-pro.md` | Advanced types, generics, refactors |
| `javascript-pro.md` | Modern JS / async / Node.js perf |
| `debugger.md` | Bug triage + root cause |
| `test-engineer.md` / `test-generator.md` / `test-runner.md` | Test infrastructure |
| `ui-ux-designer.md` | Visual design review |
| `devops-engineer.md` | CI/CD, deployment |
| `vercel-deployment-specialist.md` | Vercel platform features |
| `prompt-engineer.md` | LLM prompt design |
| `sdd-spec-writer.md` | Spec authoring |
| `task-decomposition-expert.md` | Work breakdown |
| `hackathon-ai-strategist.md` | Hackathon time-boxing + scope triage |

#### Skills (`.claude/skills/`)

Reusable skill bundles checked in alongside agents:

`agent-development`, `command-development`, `frontend-design`, `hook-development`, `mcp-integration`, `plugin-settings`, `plugin-structure`, `python-backend`, `skill-development`, `tailwind-css-patterns`, `writing-hookify-rules`, `claude-opus-4-5-migration`

#### Hooks (`.claude/hooks/`)

- `test-runner.sh` — fires after every `Edit` tool call

### MCP Servers (`.mcp.json`)

| Server | Package | Use |
|--------|---------|-----|
| `DeepGraph Next.js MCP` | `mcp-code-graph@latest vercel/next.js` | Code-graph queries against the Next.js source — symbol lookup, dependency tracing |
| `context7` | `@upstash/context7-mcp@latest` | Up-to-date library docs — preferred over web search for Next.js, Supabase, Tailwind, Radix, Groq SDK |
| `postgresql` | `@modelcontextprotocol/server-postgres` | Direct Postgres inspection during development |

### GSD Workflow Artifacts (`.planning/`)

Coarse-grain phase discipline. Files checked in so reviewers can trace the AI-driven planning process:

- `PROJECT.md` — vision, value, requirements, out-of-scope
- `REQUIREMENTS.md` — 21 functional requirements (JIRA-01 … RISK-03)
- `ROADMAP.md` — 3 phases with success criteria + coverage map
- `STATE.md` — workflow state
- `config.json` — GSD config

### Figma

- Original UI scaffold from Figma Make file `wRPCHutX4rq9ffrzrHHTlA` ("Generate UI from Markdown")
- Figma MCP plugin enabled for design-to-code round-tripping

---

## 3. Why Groq for Runtime?

Switched from Anthropic Claude to Groq (`llama-3.3-70b-versatile`) mid-build:

- Latency — Groq inference is dramatically faster, critical for streaming Turkish review and live breakdown
- Cost — hackathon budget
- Quality — sufficient for the structured-JSON tasks we ask of it

The architecture pins the model in one place per route so swapping back to Claude (or any provider) is a one-line change.

---

## 4. Reproducing the AI Setup

```bash
# 1. Open project in Claude Code
cd aigle && claude

# 2. .claude/ is checked in — agents, skills, hooks, settings activate automatically
# 3. .mcp.json registers DeepGraph, context7, postgresql MCP servers
# 4. .planning/ provides GSD context any agent can read
# 5. Set GROQ_API_KEY in .env.local for runtime AI features
```

That's the whole loop — code → build-time AI (Claude Code + MCP) → runtime AI (Groq) → user.
