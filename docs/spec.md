# aigle – AI Powered Agile Manager
IFTS AI Hackathon 2026 – MVP Specification

## 1. Amaç ve Vizyon

### 1.1 Problem Tanımı
Geleneksel Scrum/Kanban süreçlerinde:
- Sprint planning manuel ve subjektiftir
- Task breakdown zaman alır ve kişiye bağlıdır
- Sprint review ve raporlama ciddi zaman kaybı yaratır

Bu durum geliştiricilerin **kod geliştirmek yerine süreç yönetimiyle vakit kaybetmesine** neden olur.

### 1.2 Çözüm Vizyonu
**aigle**, Jira verilerini **sadece okuyarak**:
- Sprint planlamayı tahminler ile destekleyen
- Task’ları otomatik teknik alt görevlere bölen
- Sprint sonunda otomatik, anlatılabilir bir review üreten  
bir **AI destekli Agile Manager** sunar.

> North Star:  
> “Scrum Master’ın düşünme yükünü AI’ya devredip takımı tamamen değer üretmeye odaklamak”

---

## 2. Kapsam ve MVP Tanımı

Bu MVP, 4 saatlik hackathon süresi içinde:
- Çalışan bir demo
- Net AI katkısı
- Anlatılabilir karar mekanizmaları  
sunmayı hedefler.

**Out of Scope**
- Jira’ya yazma işlemleri
- Gerçek production deploy zorunluluğu
- Çoklu proje / çoklu takım desteği

---

## 3. Kullanıcı Rolleri

### 3.1 Scrum Master / Team Lead
- Sprint planlama süresini kısaltmak ister
- Takım kapasitesini objektif görmek ister

### 3.2 Developer
- Task’ların net ve mantıklı bölünmesini ister
- Üzerine düşen işin neden kendisine verildiğini bilmek ister

### 3.3 Manager / Stakeholder
- Sprint sonunda “ne başardık?” sorusuna hızlı cevap ister

---

## 4. Epikler ve Fonksiyonel Gereksinimler

---

## EPIC 1 – Akıllı Sprint Planlama (Predictive Planning)

### 4.1 Jira Entegrasyonu (Read-Only)
- Jira REST API kullanılır
- Okunan veriler:
  - Backlog item’ları (story, bug)
  - Sprint bilgileri
  - Geçmiş sprint velocity’leri
  - Task status geçmişi

> ⚠️ Jira üzerinde **hiçbir yazma işlemi yapılmaz**

---

### 4.2 Predictive Sizing (AI Tahmini)

#### Girdi
- Task summary
- Task description
- Label / component bilgisi
- Geçmiş sprint verileri

#### AI Çıktısı
- Önerilen Story Point
- Güven skoru (%)
- Referans alınan benzer task sayısı

#### Yaklaşım
- Semantic similarity (embedding)
- Velocity ortalaması + trend analizi
- LLM ile explainable tahmin

#### Örnek Çıktı
> “Bu task için önerilen size: **5 SP**  
> Benzer 8 task’ın ortalaması: 4.8 SP  
> Güven: %82”

---

### 4.3 (Bonus) Blocker Risk Analizi
- Geçmişte “blocked” olmuş task’lar analiz edilir
- Ortak nedenler çıkarılır

#### AI Çıktısı
> “Bu task %60 ihtimalle backend bağımlılığı nedeniyle bloklanabilir.”

---

## EPIC 2 – Otomatik Görev Kırılımı & Akıllı Atama

---

### 5.1 Task Decomposition (LLM Destekli)

#### Amaç
Tek bir Jira task’ını, **teknik olarak yapılabilir alt görevlere** ayırmak.

#### Alt Görev Türleri
- Frontend
- Backend
- Database
- Test / QA
- DevOps (opsiyonel)

#### AI Prompt Çıktısı
- Alt görev adı
- Kısa açıklama
- Tahmini süre / point
- Bağımlılıklar

---

### 5.2 Yetkinlik Bazlı Akıllı Atama

#### Girdi
- Takım üyeleri (manuel JSON)
- Yetkinlik matrisi
- Mevcut sprint yükü (capacity)

#### AI Kararı
- En uygun kişi önerisi
- Atama gerekçesi (explainable)

#### Örnek Açıklama
> “Bu backend alt görevi Mehmet’e önerildi.  
> Sebep: Benzer 3 task geçmişi + mevcut yük %40.”

---

### 5.3 Raporlama
- Task breakdown tablosu
- Atama önerileri
- Gerekçeli AI açıklamaları

---

## EPIC 3 – AI Sprint Review & Yönetici Paneli

---

### 6.1 Otomatik Sprint Review Metni

#### AI Tarafından Üretilen Bölümler
- ✅ Bu sprint neler tamamlandı
- ⚠️ Planlanan vs gerçekleşen farklar
- 🚧 Taşan işler ve nedenleri

#### Örnek Metin
> “Sprint boyunca 24 SP planlandı, 21 SP tamamlandı.  
> Sapmanın ana sebebi X task’ındaki bağımlılık gecikmesidir.”

---

### 6.2 Dashboard Metrikleri

#### Görselleştirilen Veriler
- Velocity trend
- Planned vs Done (bar chart)
- Spillover rate (%)
- Ortalama cycle time

---

### 6.3 (Bonus) Sprint Health Score

#### Skor Aralığı
- 1 – 100

#### Hesaplama Faktörleri
- Velocity uyumu
- Spillover oranı
- Blocked task sayısı
- Overcommit oranı

#### Örnek Çıktı
> Sprint Health: **78 / 100**  
> Risk Alanı: Backend bağımlılıkları

---

## 7. AI Stratejisi ve Agent Yapısı

### 7.1 Kullanılan AI Rolleri
- **Planner AI** → Sprint & sizing
- **Tech Lead AI** → Task breakdown
- **Scrum Master AI** → Review & health score

### 7.2 Explainable AI Prensibi
Her AI çıktısı:
- “Neye göre bu sonucu verdim?” açıklaması içerir

---

## 8. Teknik Mimari

### 8.1 Genel Mimari
``Frontend (Next.js)
└─ Dashboard / Demo UI
Backend (FastAPI)
├─ Jira Reader Service
├─ Sprint Analyzer
├─ AI Orchestrator
LLM Provider
└─ Prompt-based interaction

---

### 8.2 Teknoloji Yığını
- Frontend: Next.js + Tailwind
- Backend: Python FastAPI
- AI: LLM (ChatGPT / Claude vb.)
- Data: In-memory + JSON

---

## 9. Demo Senaryosu (Sunum Akışı)

1. Jira’dan backlog okunur
2. AI sizing önerisi gösterilir
3. Task otomatik bölünür
4. Akıllı atamalar açıklanır
5. Sprint review metni üretilir
6. Health score gösterilir

---

## 10. Başarı Kriterleri

- ✅ Çalışan demo
- ✅ Net AI katkısı
- ✅ Explainable kararlar
- ✅ Basit ama etkili UI
- ✅ Okunabilir ve güçlü dokümantasyon

---

## 11. Gelecek Geliştirmeler (Post-Hackathon)

- Jira write-back
- Slack / Teams bot
- Multi-team destek
- Gerçek zamanlı risk uyarıları

---

## 12. Sonuç

aigle, Scrum/Kanban süreçlerindeki
**bürokratik yükü minimize eden**,  
**veriye dayalı kararlar sunan**,  
**AI-first bir Agile Manager MVP’sidir.**
