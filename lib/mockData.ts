export type Sprint = { id: string; name: string; range: string };

export const sprints: Sprint[] = [
  { id: "s10", name: "Sprint 10", range: "Mar 3 – Mar 14" },
  { id: "s11", name: "Sprint 11", range: "Mar 17 – Mar 28" },
  { id: "s12", name: "Sprint 12", range: "Mar 31 – Apr 11" },
  { id: "s13", name: "Sprint 13", range: "Apr 14 – Apr 25" },
  { id: "s14", name: "Sprint 14", range: "Apr 28 – May 9" },
];

export const velocityTrend = [
  { sprint: "S10", velocity: 34 },
  { sprint: "S11", velocity: 38 },
  { sprint: "S12", velocity: 40 },
  { sprint: "S13", velocity: 34 },
  { sprint: "S14", velocity: 42 },
];

export const plannedVsDone = [
  { name: "Stories", Planned: 16, Done: 14 },
  { name: "Bugs", Planned: 5, Done: 5 },
  { name: "Tech Debt", Planned: 3, Done: 2 },
];

export type BacklogTask = {
  id: string;
  title: string;
  type: "story" | "bug";
  currentSP: number | null;
  aiSP: number;
  confidence: number;
  references: number;
  rationale: string;
  passes: boolean;
  rejectReason?: string;
};

export const backlog: BacklogTask[] = [
  {
    id: "t1",
    title: "Login page broken on Safari",
    type: "bug",
    currentSP: null,
    aiSP: 5,
    confidence: 82,
    references: 8,
    rationale: "Benzer geçmiş tasklar ortalama 4.8 SP sürmüş. Safari özel davranışı önceki sprintlerde de gözlemlendi.",
    passes: true,
  },
  {
    id: "t2",
    title: "Add OAuth provider integration",
    type: "story",
    currentSP: null,
    aiSP: 13,
    confidence: 41,
    references: 2,
    rationale: "Acceptance criteria eksik, geçmiş referans az.",
    passes: false,
    rejectReason: "No acceptance criteria. Add at least 3 testable conditions before sizing.",
  },
  {
    id: "t3",
    title: "Dashboard refactor — modular widgets",
    type: "story",
    currentSP: null,
    aiSP: 8,
    confidence: 76,
    references: 5,
    rationale: "Component split daha önce yapıldı (S12). UI değişikliği görece düşük riskli.",
    passes: true,
  },
  {
    id: "t4",
    title: "Implement Payment Flow",
    type: "story",
    currentSP: null,
    aiSP: 8,
    confidence: 88,
    references: 11,
    rationale: "Önceki ödeme entegrasyonu 7 SP sürmüştü, ek 1 SP regresyon testi için.",
    passes: true,
  },
  {
    id: "t5",
    title: "Email notification spam loop",
    type: "bug",
    currentSP: null,
    aiSP: 3,
    confidence: 90,
    references: 4,
    rationale: "Kök neden büyük olasılıkla cron + retry. Geçen sprintteki benzer hata 2 SP.",
    passes: true,
  },
];

export type Subtask = {
  type: "FE" | "BE" | "DB" | "Test";
  name: string;
  sp: number;
  assignee: string;
};

export const subtasks: Subtask[] = [
  { type: "FE", name: "Payment UI form", sp: 2, assignee: "Ayşe" },
  { type: "BE", name: "Payment API", sp: 3, assignee: "Mehmet" },
  { type: "DB", name: "Transactions table", sp: 1, assignee: "Mehmet" },
  { type: "Test", name: "E2E payment flow", sp: 2, assignee: "Can" },
];

export const assignmentRationale = [
  {
    person: "Ayşe",
    text: "FE: 2 similar FE tasks last sprint, load 40%, skill match: React ✓",
  },
  {
    person: "Mehmet",
    text: "BE+DB: ödeme modülü 3 sprint geçmişi, load 55%, skill match: FastAPI ✓",
  },
  {
    person: "Can",
    text: "Test: Playwright sahibi, load 30%, daha önce ödeme regresyonunu kurdu.",
  },
];

export const teamLoad = [
  { name: "Ayşe", load: 40 },
  { name: "Mehmet", load: 55 },
  { name: "Can", load: 30 },
];

export const healthScore = 78;
export const healthFactors = [
  { name: "Velocity", value: 95, status: "ok" as const },
  { name: "Spillover", value: 60, status: "warn" as const },
  { name: "Blockers", value: 80, status: "ok" as const },
  { name: "Overcommit", value: 80, status: "ok" as const },
];

export const reviewNarrative =
  "Sprint 14 boyunca 24 SP planlandı, 21 SP tamamlandı. Sapmanın ana sebebi backend bağımlılık gecikmesidir. Ödeme modülünde DB şeması 2 gün geç teslim edildi; bu da E2E test penceresini daralttı. Frontend tarafı planlanan kapasitenin %110'unu kullandı ve spillover'ın 3 task ile sınırlı kalmasını sağladı. Önümüzdeki sprintte BE kapasitesinin %15 artırılması ve şema onaylarının sprint başında yapılması önerilir.";

export const roastText =
  "Frontend 2 günde login'i bitirmiş, backend 1 haftadır şemada kaybolmuş. Bu tempoyla release'i roadmap'e değil takvime yazmak lazım. Ayrıca \"OAuth\" diye açılan task acceptance criteria'sız geldi — yani biri sadece kelimeyi sevmiş. Tebrikler, retro'ya bir slide daha kazandık.";

export const blockableTasks = [
  { id: "db1", name: "DB schema task" },
  { id: "be1", name: "BE payment API" },
  { id: "fe1", name: "FE dashboard refactor" },
];

export const impactChain = [
  { level: 0, status: "blocked" as const, label: "DB schema task BLOCKED", detail: "" },
  { level: 1, status: "risk" as const, label: "BE payment API", detail: "risk 70%, +2 days" },
  { level: 2, status: "risk" as const, label: "FE payment UI", detail: "risk 40%, +3 days" },
];

export function healthColor(score: number) {
  if (score >= 75) return "emerald";
  if (score >= 50) return "amber";
  return "rose";
}

export function healthLabel(score: number) {
  if (score >= 75) return "Good";
  if (score >= 50) return "Warning";
  return "Critical";
}
