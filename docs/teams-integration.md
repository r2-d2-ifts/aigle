# Teams Entegrasyonu — Çalıştırma Rehberi

AgileMind AI ↔ Microsoft Teams iki yönlü entegrasyonu. Tek bir **Teams Workflows
incoming webhook** (`TEAMS_WEBHOOK_URL`) üzerinden çalışır.

## Yönler

| Yön | Ne yapar | Dosyalar |
| --- | --- | --- |
| **App → Teams** | Fikir gönderilince + dashboard butonlarıyla kanala Adaptive Card atar | `app/actions/teams.ts`, `app/api/teams-notify/route.ts`, `components/teams-query-panel.tsx` |
| **Teams → App (canlı)** | Kanala sabit "Kontrol Paneli" kartı; butonlar canlı veri kartı geri yollar | `scripts/post-control-panel.mjs`, `app/api/teams-query/route.ts` |
| **Teams → App (komut botu)** | Power Automate akışı `/komut` mesajlarına kart ile yanıt verir | `scripts/generate-pa-cards.mjs` → `scripts/pa-cards/*.json` |

## Ön koşul

`.env.local` içinde:

```
TEAMS_WEBHOOK_URL=<Teams Workflows incoming webhook URL>
```

## Hızlı doğrulama

```powershell
# 1) Webhook smoke-test (beklenen: HTTP 202)
npm run teams:test
```

Kart birkaç saniye içinde **aigle** kanalında görünmeli.

## Path A — Kontrol Paneli (önerilen, canlı veri)

Hazır ve çalışıyor; sadece dev sunucusunun Teams istemcilerinden erişilebilir
olması gerekir. Aynı ağ dışındaki kişiler için tünel kullan.

```powershell
# Terminal 1 — mock veri (127.0.0.1:3001)
npm run mock-api

# Terminal 2 — Next.js (:3000)
npm run dev          # aynı LAN için: npm run dev:lan

# Terminal 3 — public tünel
ngrok http 3000      # veya: cloudflared tunnel --url http://localhost:3000
#   → çıkan https URL'i kopyala

# Kontrol Paneli kartını gönder (tünel URL'i ile)
$env:PUBLIC_BASE_URL="https://<tunel-adresin>"; npm run teams:panel
#   veya argüman olarak: node scripts/post-control-panel.mjs https://<tunel-adresin>
```

Kanalda bir butona tıkla → tarayıcıda ✅ onay sayfası açılır → ilgili **canlı**
kart kanala düşer.

> Not: `proxy.ts` `/api/*` rotalarını auth'tan muaf tutar, bu yüzden Teams
> kullanıcıları giriş yapmadan `/api/teams-query`'e erişebilir.

## Path B — Power Automate komut botu (sabit veri, tüneL gerektirmez)

Ekran görüntüsündeki **"keyword alert"** şablonu çalışmaz — yalnızca tek bir
sabit mesaj atar, komuta göre dallanamaz. Doğru kurulum:

```powershell
# Temiz UTF-8 kartları üret → scripts/pa-cards/*.json
npm run pa-cards
```

Power Automate'te:

1. **Tetikleyici:** *"When a new channel message is added"* — Team/Channel: **aigle**.
2. **Switch** (veya Condition) → mesaj gövdesi içeriğine göre.
   - Türkçe alias'lar için `contains()` / OR kullan:
     `/summary`|`/özet`, `/sprint`, `/tasks`|`/görevler`, `/team`|`/takım`.
3. Her dalda **"Post card in a chat or channel (V3)"** → ilgili
   `scripts/pa-cards/<komut>.json` dosyasını yapıştır.

> Sınırlama: Path B kartları, üretildiği andaki `mock-api/db.json` anlık
> görüntüsüdür. Canlı veri istiyorsan post adımını `/api/teams-query`'e bir
> HTTP çağrısı ile değiştir (bu durumda tünel tekrar gerekir).

## Beklenen sonuçlar

- `npm run teams:test` → **HTTP 202**, kart kanala düşer.
- Dashboard butonları → "Teams kanalına gönderildi! 🎉" (503 = mock-api kapalı).
- Kontrol Paneli butonu → onay HTML sayfası + kanala canlı kart.
- Path B → kanala `/summary` yaz → ilgili kart gelir.