# AI Architecture & Intelligence Layer

## Abstraction Layer

Interaksi dengan Model AI diisolasi oleh kontrak:
`App\Services\AI\AIProviderInterface`

Mendukung implementasi:
- `MockAIProvider`: Default provider mandiri tanpa kuota API eksternal.
- Kompatibel dengan OpenAI (`gpt-4o-mini`, dll) dan Google Gemini.

## Pipeline Pemrosesan Pesan

```text
Incoming WhatsApp Message
       ↓
IntentDetectionService (Deteksi Intensi Beli/Komplain/Tanya Stok)
       ↓
LeadScoringService (Kalkulasi Delta Skor & Suhu Lead)
       ↓
AICustomerService (Generate Rekomendasi Respons)
       ↓
Risk Assessment
 ├─ LOW Risk    → Auto-Reply Terkirim
 └─ HIGH Risk   → Masuk ke AI Approval Center (Pending Action)
```
