🎯 IFTS AI Hackathon: AI-Powered Agile Manager
Tema: Yapay Zeka Destekli Akıllı Scrum/Kanban Asistanı ve Yönetim Paneli
Hedef: Geleneksel Scrum/Kanban süreçlerindeki sprint planlama ve raporlama iş yükünü optimize ederek, takımların tamamen "kod geliştirmeye" ve "değer üretmeye" odaklanmasını sağlamak.
 
📋 Beklenen Ana Özellikler (Epikler)
Yarışmacıların geliştireceği MVP (Minimum Uygulanabilir Ürün), aşağıdaki üç ana yeteneğe sahip olmalıdır:
1. Akıllı Planlama (Predictive Planning):
Jira backlog'undan seçilen task’ları ve size’larını okuyabilmeli. (Jira üzerinde bir yazma işlemi yapılmamalıdır, sadece okuma.)
Takımın geçmiş sprint verilerini (hız/velocity) analiz ederek, backlog’dan planlamaya dahil edilen yeni task’ların size’ları için objektif yapay zeka tahmini (Predictive Sizing) yapabilmeli.
Bonus: Task’ların bloklanma nedenlerine AI desteği için çözümler önerebilmeli.
2. Otomatik Görev Kırılımı ve Akıllı Atama (Task Decomposition):
Planlamaya dahil edilen bir task’ı saniyeler içinde mantıklı teknik alt görevlere (Frontend, Backend, DB, Test vb.) bölmeli.
Takım üyelerinin yetkinlik matrisine ve mevcut sprint yüklerine (kapasite) bakarak, görevleri en uygun kişilere akıllı eşleştirme ile en uygun atamayı önermeli.
Oluşturulan bu alt görevleri ve atama önerilerini rapor olarak sunabilmeli.
3. AI Sprint Review ve Yönetici Paneli (Dashboard):
"Bu Sprint Ne Başardık?" odaklı otomatik bir demo raporu ve özet metni üretmeli.
Planlanan vs. Gerçekleşen (Süre/Puan) sapma metriklerini görselleştiren bir dashboard sunmalı.
Bonus: Gerçekleştirilemeyen task’lar için sprint’ler arası geçişkenlik (sonraki sprint’lere kalma durumu) metriği hesaplamalı.
Bonus: Sprint için 1-100 skalasında sprint-health skoru hesaplamalı.
 
🛠️ Önerilen Teknoloji Yığını ve Araçlar
Katılımcılar çözümlerini geliştirirken aşağıdaki araçları ve teknolojileri (veya muadillerini) kullanmakta serbesttir:
Arayüz (Frontend): React, Next.js, Vue.js veya mikro-ön yüz …vb. çözümleri. (Tercihen Slack/Teams entegrasyonu sağlayan bot ara yüzleri).
Backend & Entegrasyon: Node.js, Python (FastAPI/Flask)  … vb.+ Jira REST API.
AI & LLM Altyapısı: Dilediğiniz AI aracının (Cursor, Copilot, ChatGPT, Claude vb.) seçimi tamamen size bırakılmıştır.
 