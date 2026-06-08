# AgileMind AI – Full Feature Specification
IFTS AI Hackathon 2026 – Canonical Spec (spec.md + spec2.md merged)

---

## 1. Problem & Vision

### 1.1 Problem Statement

Geleneksel Scrum/Kanban süreçlerinde ekiplerin sprint kalitesini düşüren 4 kritik problem:

1. Sprint planning manuel ve subjektiftir — detaysız task'lar yanlış boyutlandırmaya yol açar
2. Task breakdown zaman alır ve kişiye bağlıdır
3. Sprint review ve raporlama ciddi zaman kaybı yaratır ve düşük etki üretir
4. Blocker'ların zincirleme etkisi geç fark edilir; atamalar sadece kapasiteye göre yapılır

Bu durum geliştiricilerin **kod geliştirmek yerine süreç yönetimiyle vakit kaybetmesine** neden olur.

### 1.2 Solution Vision

**AgileMind AI**, Jira verilerini **sadece okuyarak**:

- Sprint planlamayı tahminler ile destekleyen
- Yetersiz task tanımlarını kalite kapısında reddeden
- Task'ları otomatik teknik alt görevlere bölen
- Takım hafızasına dayalı akıllı atama yapan
- Sprint sonunda otomatik, anlatılabilir bir review üreten
- Blocker'ların zincirleme etkisini simüle eden

bir **AI destekli Agile Manager** sunar.

> **North Star:**
> "Scrum Master'ın düşünme yükünü AI'ya devredip takımı tamamen değer üretmeye odaklamak"

---

## 2. Scope & MVP

### 2.1 In Scope

4 saatlik hackathon MVP:
- Çalışan demo
- Net AI katkısı
- Anlatılabilir karar mekanizmaları
- Read-only Jira entegrasyonu

### 2.2 Out of Scope

- Jira yazma işlemleri
- Gerçek production deploy zorunluluğu
- Çoklu proje / çoklu takım desteği
- Kullanıcı authentication
- Gerçek zamanlı WebSocket güncellemeleri

---

## 3. User Roles

| Role | Need |
|------|------|
| **Scrum Master / Team Lead** | Sprint planning süresini kısaltmak, takım kapasitesini objektif görmek, sprint riskini anında görmek |
| **Developer** | Task'ların net bölünmesi, atama gerekçesini bilmek, kısa ama gerçekçi sprint içgörüleri |
| **Manager / Stakeholder** | "Ne başardık?" sorusuna hızlı cevap, veriye dayalı demo çıktısı |

---

## 4. Epics & Functional Requirements

---

## EPIC 1 — Jira Integration (Read-Only)

### 4.1 Data Sources

Jira REST API kullanılır. Okunan veriler:
- Backlog item'ları (story, bug) — title, description, current SP, labels
- Sprint bilgileri (aktif + geçmiş)
- Geçmiş sprint velocity'leri
- Task status geçmişi (blocked, done, in progress transitions)

> ⚠️ Jira üzerinde **hiçbir yazma işlemi yapılmaz**

---

## EPIC 2 — Predictive Sizing + Anti-Bullshit Filter

### 5.1 Quality Gate (Anti-Bullshit Filter)

AI önce task tanımını kalite kapısından geçirir:
- Problem net mi?
- Platform / modül belirtilmiş mi?
- Beklenen davranış yazılmış mı?
- Acceptance criteria var mı?

Bu kontrollerden geçmeyen task için sizing üretilmez.

**AI Output (rejection):**
> "Bu task yeterince net değil. Hangi platform? Beklenen davranış ne?
> Product Owner detayları girene kadar boyutlandırma yapılamaz."

### 5.2 Predictive Sizing

#### Input
- Task summary, description, labels, components
- Geçmiş sprint verileri

#### AI Output
- Önerilen Story Point
- Güven skoru (%)
- Referans alınan benzer task sayısı
- Explainable rationale

**Example:**
> "Bu task için önerilen size: **5 SP**
> Benzer 8 task'ın ortalaması: 4.8 SP
> Güven: %82"

#### Approach
- Semantic similarity (embedding veya LLM comparison)
- Velocity ortalaması + trend analizi
- LLM with explainable output

---

## EPIC 3 — Task Decomposition (LLM-Powered)

### 6.1 Sub-task Breakdown

Tek bir Jira task'ını teknik alt görevlere ayırma.

#### Sub-task Types
- 🖥 Frontend
- ⚙ Backend
- 🗄 Database
- 🧪 Test / QA
- 🚀 DevOps (optional)

#### AI Output per Sub-task
- Alt görev adı
- Kısa açıklama
- Tahmini SP
- Bağımlılıklar

---

## EPIC 4 — Contextual Smart Assignment

### 7.1 Assignment Logic

AI her aday için birleşik skor hesaplar:
- Capacity uygunluğu (current sprint load %)
- Skill / domain eşleşmesi
- Son sprintlerde benzer task çözüm geçmişi (domain memory)

Team data: static JSON (name, skills, current load, sprint history)

#### AI Output (explainable)
> "Ödeme API alt görevi Ayşe'ye önerildi.
> Sebep: kapasitesi uygun (%40 load) ve önceki 3 sprintte ödeme modülü task'larını çözmüş."

---

## EPIC 5 — Sprint Review Dashboard

### 8.1 Metrics Visualized
- Velocity trend (line chart, son 5 sprint)
- Planned vs Done (bar chart — Stories / Bugs / Tech Debt)
- Spillover rate (%)
- Average cycle time
- Blocked task count

### 8.2 Auto Sprint Review Narrative

AI tarafından üretilen bölümler:
- ✅ Bu sprint neler tamamlandı
- ⚠️ Planlanan vs gerçekleşen farklar
- 🚧 Taşan işler ve nedenleri

**Example:**
> "Sprint boyunca 24 SP planlandı, 21 SP tamamlandı.
> Sapmanın ana sebebi X task'ındaki bağımlılık gecikmesidir."

### 8.3 Sprint Health Score (Bonus)

Skor: 1 – 100

Hesaplama faktörleri:
- Velocity uyumu
- Spillover oranı
- Blocked task sayısı
- Overcommit oranı

**Example:** `Sprint Health: 78 / 100 | Risk: Backend bağımlılıkları`

---

## EPIC 6 — Roast My Sprint (Humorous Review)

### 9.1 Purpose

Dashboard'a "Roast My Sprint" butonu eklenir.
AI sprint metriklerine göre kısa, esprili ve veriye dayalı eleştiri üretir.

### 9.2 Tone Rules
- Mizahi ama hakaret içermeyen
- Veriye dayalı
- Takımı aşağılamayan, aksiyon öneren

**Example:**
> "Frontend ekip 2 günde login'i bitirmiş, backend 1 haftadır şemada kaybolmuş.
> Bu tempoyla release'i roadmap'e değil takvime yazmak lazım."

---

## EPIC 7 — Butterfly Effect Simulator

### 10.1 Purpose

Bir task bloklandığında diğer task'lara zincirleme etkiyi tahmin etmek.

### 10.2 How It Works
- Dependency graph oluşturulur
- Bloklanan task kaynak node olarak işaretlenir
- Downstream task'lara risk yayılımı hesaplanır
- Sprint Health üzerindeki delta gösterilir

### 10.3 Output Fields
- Etkilenen task listesi
- Risk olasılığı (%)
- Beklenen gecikme (gün)
- Health score delta
- Önerilen mitigation aksiyonları

**Example:**
> "Veritabanı task'ı bloklandı → Frontend entegrasyonu %40 gecikme riski.
> Sprint Health %85'ten %60'a düştü."

---

## 11. AI Strategy

### 11.1 AI Roles

| Role | Responsibility |
|------|---------------|
| **Planner AI** | Sprint & sizing — predictive estimation, quality gate |
| **Tech Lead AI** | Task breakdown — decompose into typed sub-tasks |
| **Scrum Master AI** | Review & health score — narrative, roast, butterfly |

### 11.2 Explainable AI Principle

Her AI çıktısı: "Neye göre bu sonucu verdim?" açıklaması içerir.

---

## 12. Technical Architecture

### 12.1 Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router) + Tailwind CSS v4 + shadcn/ui |
| AI | Anthropic Claude API (claude-sonnet-4-5 or claude-haiku-4-5) |
| Data | In-memory + JSON (mock fallback) |
| Jira | Jira REST API v2/v3 (read-only) |

### 12.2 API Routes

```
app/api/
├── jira/backlog/route.ts        GET  — backlog items
├── jira/sprints/route.ts        GET  — sprint history + velocity
├── ai/sizing/route.ts           POST — LLM story point estimate
├── ai/breakdown/route.ts        POST — LLM task decomposition (streaming)
├── ai/review/route.ts           POST — LLM sprint review narrative
├── ai/roast/route.ts            POST — LLM roast critique
└── risk/butterfly/route.ts      POST — blocker impact simulation
```

---

## 13. Demo Flow (6 Steps)

1. **Backlog açılır** — Jira'dan task listesi yüklenir
2. **Anti-Bullshit filtresi** — yetersiz task kalite kapısında reddedilir
3. **AI Sizing** — geçen task için SP önerisi ve güven skoru gösterilir
4. **Task Decomposition** — seçilen task alt görevlere bölünür, atamalar açıklanır
5. **Butterfly Effect** — bir task bloklanır, zincirleme etki simüle edilir
6. **Sprint Review** — standart review narrative + "Roast My Sprint" sunulur + Health Score

---

## 14. Success Criteria

- ✅ Çalışan demo
- ✅ Net AI katkısı (explainable outputs)
- ✅ Anti-Bullshit gate işlevsel
- ✅ Butterfly Effect gösterimi
- ✅ Roast My Sprint jüriye etki bırakıyor
- ✅ Read-only Jira yaklaşımına tam uyum
- ✅ Basit ama etkili UI

---

## 15. Post-Hackathon Roadmap

- Jira write-back (create sub-tasks)
- Slack / Teams bot interface
- Multi-team support
- Real-time risk alerts
- Persistent sprint history DB

---

*Last updated: 2026-06-08 — merged from spec.md + spec2.md*
