# AgileMind AI – Advanced Feature Specs
IFTS AI Hackathon 2026 – Spec Pack v2

## 1. Amaç ve Vizyon

### 1.1 Problem Tanımı
Takımların sprint kalitesini düşüren 4 kritik problem:
- Detaysız task’lar yüzünden yanlış boyutlandırma
- Sprint review çıktılarının düşük etki yaratması
- Blocker’ların zincirleme etkisinin geç fark edilmesi
- Atamaların sadece kapasiteye göre yapılması (bağlam eksikliği)

### 1.2 Çözüm Vizyonu
Bu doküman, AgileMind AI için jüri etkisi yüksek 4 yeni AI özelliğini tanımlar:
- Anti-Bullshit Filtresi
- Roast My Sprint
- Kelebek Etkisi Simülatörü
- Kod Geçmişine Göre Akıllı Atama

---

## 2. Kapsam ve Tanım

Bu spec, hackathon demosunda uygulanabilir ama güçlü etki yaratan özellikleri kapsar.

**Out of Scope**
- Jira write-back
- Production-grade otomasyon
- Çoklu takım optimizasyonu

---

## 3. Kullanıcı Rolleri

### 3.1 Scrum Master / Team Lead
- Net olmayan task’ları erken reddetmek ister
- Sprint riskini blocker anında görmek ister

### 3.2 Developer
- Mantıklı, explainable ve adil atama bekler
- Kısa ama gerçekçi sprint içgörüleri ister

### 3.3 Manager / Stakeholder
- Veriye dayalı ve etkili demo çıktısı görmek ister

---

## 4. Epikler ve Fonksiyonel Gereksinimler

---

## EPIC 1 – Anti-Bullshit Filtresi (Gereksinim Reddedici)

### 4.1 Amaç
Yetersiz task tanımı varsa AI’nın sizing yapmasını engellemek.

### 4.2 Nasıl Çalışır
AI önce “task quality gate” kontrolü yapar:
- Problem net mi?
- Platform/modül belirtilmiş mi?
- Beklenen davranış yazılmış mı?
- Acceptance criteria var mı?

Bu kontrollerden geçmeyen task için sizing üretilmez.

### 4.3 AI Çıktısı (Örnek)
> “Bu task yeterince net değil. Hangi platform? Beklenen davranış ne?  
> Product Owner detayları girene kadar boyutlandırma yapılamaz.”

### 4.4 Jüri Etkisi
Geliştiricilerin kronik “detaysız iş tanımı” problemine doğrudan çözüm sunar.

---

## EPIC 2 – Roast My Sprint (Acımasız Sprint Özeti)

### 5.1 Amaç
Standart sprint review’ye ek olarak mizahi ama gerçekçi ikinci bir çıktı üretmek.

### 5.2 Nasıl Çalışır
Dashboard’a “Roast My Sprint” butonu eklenir.
AI sprint metriklerine göre kısa, esprili ve veriye dayalı eleştiri üretir.

### 5.3 Ton Kuralları
- Mizahi ama hakaret içermeyen
- Veriye dayalı
- Takımı aşağılamayan, aksiyon öneren

### 5.4 AI Çıktısı (Örnek)
> “Frontend ekip 2 günde login’i bitirmiş, backend 1 haftadır şemada kaybolmuş.  
> Bu tempoyla release’i roadmap’e değil takvime yazmak lazım.”

### 5.5 Jüri Etkisi
Sunumun finalinde dikkat ve akılda kalıcılığı ciddi artırır.

---

## EPIC 3 – Kelebek Etkisi Simülatörü (Blocker Etkisi)

### 6.1 Amaç
Bir task bloklandığında diğer task’lara zincirleme etkiyi tahmin etmek.

### 6.2 Nasıl Çalışır
- Dependency graph çıkarılır
- Bloklanan task kaynak node olarak işaretlenir
- Downstream task’lara risk yayılımı hesaplanır
- Sprint Health üzerindeki delta gösterilir

### 6.3 AI Çıktısı (Örnek)
> “Veritabanı task’ı bloklandı -> Frontend entegrasyonu %40 gecikme riski.  
> Sprint Health %85’ten %60’a düştü.”

### 6.4 Çıktı Alanları
- Etkilenen task listesi
- Risk olasılığı (%)
- Beklenen gecikme (gün)
- Health score delta
- Önerilen mitigation aksiyonları

### 6.5 Jüri Etkisi
AI’ın sadece okuma değil “predictive reasoning” kabiliyetini net gösterir.

---

## EPIC 4 – Kod Geçmişine Göre Akıllı Atama (Contextual Assignment)

### 7.1 Amaç
Atamayı yalnızca workload ile değil, domain hafızası ve geçmiş başarı ile yapmak.

### 7.2 Nasıl Çalışır
AI, her aday için birleşik skor hesaplar:
- Capacity uygunluğu
- Skill/domain eşleşmesi
- Son sprintlerde benzer task çözüm geçmişi

### 7.3 AI Çıktısı (Örnek)
> “Ödeme API alt görevi Ayşe’ye önerildi.  
> Sebep: kapasitesi uygun ve önceki 3 sprintte ödeme modülü bug’larını çözmüş.”

### 7.4 Jüri Etkisi
Yüzeysel atama yerine takım hafızasını simüle eden daha “gerçekçi liderlik” hissi verir.

---

## 8. Demo Akışı (Güncellenmiş)

1. Backlog’dan bir task seçilir
2. Anti-Bullshit filtresi kalite kontrol yapar
3. Geçen task için decomposition + contextual assignment gösterilir
4. Bir task bloklanır ve kelebek etkisi simüle edilir
5. Sprint sonunda standart review + Roast My Sprint sunulur

---

## 9. Başarı Kriterleri

- ✅ Çalışan demo
- ✅ 4 özelliğin net AI katkısı
- ✅ Explainable karar ve gerekçeler
- ✅ Jüriye hem teknik hem eğlenceli sunum etkisi
- ✅ Read-only Jira yaklaşımına tam uyum

---

## 10. Sonuç

Bu 4 özellik ile AgileMind AI,
**sadece raporlayan bir araçtan**,  
**kalite kontrol eden, öngören ve bağlamsal karar veren bir AI Agile Manager’a** dönüşür.
'@ | Set-Content -Path "C:\Users\TCSBESDAS\IdeaProjects\hcktoon\aigle\command\spec2.md" -Encoding utf8
