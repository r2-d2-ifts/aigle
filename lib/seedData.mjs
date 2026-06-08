// Shared seed data — imported by both scripts/seed.mjs (CLI) and app/api/seed/route.ts (API)

export const sprints = [
  { id: "s10", name: "Sprint 10", start_date: "Mar 3",  end_date: "Mar 14", status: "closed", velocity: 34, planned_sp: 38, done_sp: 34 },
  { id: "s11", name: "Sprint 11", start_date: "Mar 17", end_date: "Mar 28", status: "closed", velocity: 38, planned_sp: 38, done_sp: 38 },
  { id: "s12", name: "Sprint 12", start_date: "Mar 31", end_date: "Apr 11", status: "closed", velocity: 44, planned_sp: 40, done_sp: 44 },
  { id: "s13", name: "Sprint 13", start_date: "Apr 14", end_date: "Apr 25", status: "closed", velocity: 29, planned_sp: 44, done_sp: 29 },
  { id: "s14", name: "Sprint 14", start_date: "Apr 28", end_date: "May 9",  status: "active", velocity: 42, planned_sp: 40, done_sp: 34 },
];

export const teamMembers = [
  { name: "Dursun Koc",            email: "dursun.koc@turkcell.com.tr",      skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "System Design"], current_load: 50, domain_history: [{ domain: "Full Stack", sprints: 8 }, { domain: "BE", sprints: 6 }, { domain: "Architecture", sprints: 5 }] },
  { name: "Muhammet Yusuf Namdar", email: "muhammet.namdar@turkcell.com.tr", skills: ["Java", "Spring Boot", "Kafka", "Microservices", "PostgreSQL", "Elasticsearch"], current_load: 65, domain_history: [{ domain: "BE", sprints: 7 }, { domain: "DB", sprints: 4 }, { domain: "Search", sprints: 3 }] },
  { name: "Sevinc Besdas",         email: "sevinc.besdas@turkcell.com.tr",   skills: ["React", "TypeScript", "Playwright", "Jest", "Accessibility", "Design System"], current_load: 40, domain_history: [{ domain: "FE", sprints: 6 }, { domain: "QA", sprints: 5 }, { domain: "UX", sprints: 3 }] },
  { name: "Izzet Ozturk",          email: "izzet.ozturk@turkcell.com.tr",    skills: ["Kubernetes", "Docker", "Terraform", "GitHub Actions", "Prometheus", "AWS"], current_load: 30, domain_history: [{ domain: "DevOps", sprints: 7 }, { domain: "Infra", sprints: 5 }, { domain: "SRE", sprints: 4 }] },
];

export const tasks = [
  { id: "t1", title: "Login page broken on Safari 17", type: "bug", current_sp: null, ai_sp: 5, confidence: 82, references_count: 8, status: "backlog", sprint_id: null, passes: true, reject_reason: null,
    rationale: "Safari-spesifik CSS rendering hatası. Benzer geçmiş tasklar ortalama 4.8 SP sürmüş." },
  { id: "t2", title: "Add OAuth provider integration", type: "story", current_sp: null, ai_sp: 13, confidence: 38, references_count: 2, status: "backlog", sprint_id: null, passes: false,
    reject_reason: "Acceptance criteria eksik. Hangi OAuth provider? Callback URL yapısı? Token refresh stratejisi?",
    rationale: "Yetersiz tanım nedeniyle boyutlandırma güvenilir değil." },
  { id: "t3", title: "Dashboard widget modularization", type: "story", current_sp: null, ai_sp: 8, confidence: 76, references_count: 5, status: "backlog", sprint_id: null, passes: true, reject_reason: null,
    rationale: "Sprint 12'de benzer component refactor 7 SP sürdü. Widget izolasyonu iyi tanımlanmış." },
  { id: "t4", title: "Implement Payment Flow (Stripe)", type: "story", current_sp: 8, ai_sp: 8, confidence: 91, references_count: 11, status: "in_progress", sprint_id: "s14", passes: true, reject_reason: null,
    rationale: "Önceki ödeme entegrasyonu 7 SP sürdü. Stripe daha iyi dökümanlı, ek 1 SP regresyon ve webhook testi için." },
  { id: "t5", title: "Payment DB schema & migrations", type: "story", current_sp: 3, ai_sp: 3, confidence: 88, references_count: 6, status: "in_progress", sprint_id: "s14", passes: true, reject_reason: null,
    rationale: "transactions, refunds, webhooks tabloları. Geçmiş şema migrasyonları 2-3 SP aralığında." },
  { id: "t6", title: "Checkout flow UI integration", type: "story", current_sp: 5, ai_sp: 5, confidence: 84, references_count: 7, status: "in_progress", sprint_id: "s14", passes: true, reject_reason: null,
    rationale: "t4 ve t5'e bağımlı. UI tarafı hazır, API entegrasyonu ve DB şeması tamamlanınca test edilebilir." },
  { id: "t7", title: "Email notification spam loop fix", type: "bug", current_sp: null, ai_sp: 3, confidence: 90, references_count: 4, status: "backlog", sprint_id: null, passes: true, reject_reason: null,
    rationale: "Cron + retry kombinasyonu şüpheli. Sprint 13'te benzer bildirim hatası 2 SP'de çözüldü." },
  { id: "t8", title: "Kafka migration", type: "story", current_sp: null, ai_sp: 21, confidence: 22, references_count: 1, status: "backlog", sprint_id: null, passes: false,
    reject_reason: "Kapsam belirsiz. Hangi servisler migrate ediliyor? Event schema tasarımı yapıldı mı? Rollback planı?",
    rationale: "Yetersiz tanım — spike önce yapılmalı." },
  { id: "t9", title: "Search performance optimization (Elasticsearch)", type: "story", current_sp: null, ai_sp: 13, confidence: 71, references_count: 3, status: "backlog", sprint_id: null, passes: true, reject_reason: null,
    rationale: "Mevcut p95 latency 1.2s, hedef 200ms. Index stratejisi ve query optimization gerekiyor." },
  { id: "t10", title: "GDPR data export endpoint", type: "story", current_sp: null, ai_sp: 8, confidence: 80, references_count: 4, status: "backlog", sprint_id: null, passes: true, reject_reason: null,
    rationale: "KVKK uyumu zorunlu. Kullanıcı verisi export, anonymization ve audit log içeriyor." },
  { id: "t11", title: "Mobile app crash on iOS 17.4 (swipe gesture)", type: "bug", current_sp: null, ai_sp: 5, confidence: 85, references_count: 6, status: "backlog", sprint_id: null, passes: true, reject_reason: null,
    rationale: "React Native gesture handler v2 ile iOS 17.4 uyumsuzluğu. Crash log mevcut." },
  { id: "t12", title: "API rate limiting (per-user, Redis)", type: "story", current_sp: null, ai_sp: 5, confidence: 87, references_count: 5, status: "backlog", sprint_id: null, passes: true, reject_reason: null,
    rationale: "Redis sliding window implementasyonu. Benzer middleware Sprint 10'da 4 SP sürdü." },
  { id: "t13", title: "Dark mode support — design system tokens", type: "story", current_sp: null, ai_sp: 8, confidence: 73, references_count: 4, status: "backlog", sprint_id: null, passes: true, reject_reason: null,
    rationale: "CSS custom properties hazır, component-level override gerekiyor." },
  { id: "t14", title: "Push notification service", type: "story", current_sp: null, ai_sp: 0, confidence: 0, references_count: 0, status: "backlog", sprint_id: null, passes: false,
    reject_reason: "Platform belirtilmemiş (iOS? Android? Web?). Hangi bildirim tetikleyicileri? FCM mi APNs mi?",
    rationale: "Boyutlandırma için yeterli bilgi yok." },
  { id: "t15", title: "Checkout A/B test — CTA button variants", type: "story", current_sp: null, ai_sp: 3, confidence: 92, references_count: 9, status: "backlog", sprint_id: null, passes: true, reject_reason: null,
    rationale: "Feature flag altyapısı mevcut. A/B test setup benzer görevde 2-3 SP sürdü." },
];

export const subtasks = [
  { task_id: "t4", type: "FE",   name: "Stripe payment form UI",        description: "Card input, validation, loading states",                                sp: 2, assignee: "Sevinc Besdas",         dependencies: [] },
  { task_id: "t4", type: "BE",   name: "Stripe webhook handler",         description: "Payment confirmation, failure, refund events",                          sp: 3, assignee: "Muhammet Yusuf Namdar", dependencies: ["t5"] },
  { task_id: "t4", type: "DB",   name: "Transactions & webhooks schema", description: "transactions, payment_events, refund_requests tables",                  sp: 1, assignee: "Muhammet Yusuf Namdar", dependencies: [] },
  { task_id: "t4", type: "Test", name: "E2E payment flow tests",          description: "Happy path + failure scenarios with Stripe test cards",                  sp: 2, assignee: "Sevinc Besdas",         dependencies: ["t4"] },
  { task_id: "t9", type: "BE",   name: "Elasticsearch index redesign",    description: "Analyzer config, field mappings, shard strategy",                        sp: 5, assignee: "Muhammet Yusuf Namdar", dependencies: [] },
  { task_id: "t9", type: "BE",   name: "Query optimization layer",         description: "Cached aggregations, filter rewrite, explain API",                       sp: 5, assignee: "Muhammet Yusuf Namdar", dependencies: [] },
  { task_id: "t9", type: "Test", name: "Performance benchmarks (k6)",      description: "Load test before/after, p95/p99 validation",                             sp: 3, assignee: "Sevinc Besdas",         dependencies: [] },
  { task_id: "t10", type: "BE",   name: "Data collection & serialization", description: "Aggregate user data from all services",                                  sp: 3, assignee: "Dursun Koc",            dependencies: [] },
  { task_id: "t10", type: "BE",   name: "Anonymization pipeline",          description: "PII scrubbing, pseudonymization rules",                                  sp: 2, assignee: "Muhammet Yusuf Namdar", dependencies: [] },
  { task_id: "t10", type: "FE",   name: "Export request UI & download",    description: "Self-service portal, email notification on ready",                       sp: 2, assignee: "Sevinc Besdas",         dependencies: [] },
  { task_id: "t10", type: "Test", name: "GDPR compliance audit tests",      description: "Data completeness, access log validation",                               sp: 1, assignee: "Sevinc Besdas",         dependencies: [] },
];

export const sprintHealth = [
  { sprint_id: "s10", velocity_score: 70, spillover_score: 55, blocker_score: 60, overcommit_score: 65, health_score: 62, spillover_rate: 22.0, cycle_time_days: 3.1, blocked_count: 4 },
  { sprint_id: "s11", velocity_score: 85, spillover_score: 75, blocker_score: 80, overcommit_score: 80, health_score: 80, spillover_rate: 13.0, cycle_time_days: 2.6, blocked_count: 2 },
  { sprint_id: "s12", velocity_score: 95, spillover_score: 90, blocker_score: 90, overcommit_score: 85, health_score: 90, spillover_rate: 5.0,  cycle_time_days: 1.9, blocked_count: 1 },
  { sprint_id: "s13", velocity_score: 50, spillover_score: 30, blocker_score: 40, overcommit_score: 35, health_score: 38, spillover_rate: 47.0, cycle_time_days: 4.2, blocked_count: 8 },
  { sprint_id: "s14", velocity_score: 90, spillover_score: 65, blocker_score: 75, overcommit_score: 85, health_score: 78, spillover_rate: 15.0, cycle_time_days: 2.3, blocked_count: 2 },
];
