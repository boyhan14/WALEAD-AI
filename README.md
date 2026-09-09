# WALEAD AI

> **"Turn conversations into revenue."**
> AI Revenue Recovery & Sales Automation Platform for Indonesian SMBs.

---

## 🚀 Fitur Utama

- **Omnichannel WhatsApp Inbox**: Mengelola interaksi pelanggan dalam satu antarmuka modern yang cepat.
- **Intent Detection & Lead Scoring**: Mendeteksi niat beli secara otomatis dan mengkategorikan lead (Cold, Warm, Hot, Very Hot).
- **Human-In-The-Loop AI Approval Center**: Memastikan respons berisiko tinggi (diskon, komplain) diverifikasi oleh tim sebelum dikirim ke pelanggan.
- **Abandoned Conversation Recovery**: Mendeteksi percakapan pelanggan yang menggantung dan memicu pesan pemulihan omset.
- **Multi-Tenant Workspace**: Isolasi data ketat per workspace/toko untuk keamanan data UMKM.
- **Customer Simulator & Mock Providers**: Jalankan seluruh alur WhatsApp & AI tanpa perlu API key berbayar.

---

## 🛠️ Tech Stack

- **Backend**: Laravel 13, PHP 8.4, PostgreSQL, Redis
- **Frontend**: React 18, Inertia.js, TypeScript, Tailwind CSS
- **AI / Integrasi**: AI Provider Abstraction (Mock/OpenAI/Gemini), WhatsApp Cloud API Abstraction (Mock/Meta)

---

## ⚡ Instalasi Cepat (Quick Start)

### 1. Clone & Setup Dependensi
```bash
git clone <repo-url>
cd "WALEAD AI"

composer install
npm install --legacy-peer-deps
```

### 2. Konfigurasi Environment
Salin file environment:
```bash
cp .env.example .env
php artisan key:generate
```

Pastikan konfigurasi PostgreSQL di `.env` sudah sesuai:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=walead_ai
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

**Konfigurasi AI (default: Gemini):**
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=<key-dari-Google-AI-Studio>
AI_MODEL=gemini-3.6-flash
```
Dapatkan API key Gemini gratis di https://aistudio.google.com/app/apikey.
Pilihan lain: `AI_PROVIDER=mock` (tanpa API key, untuk development) atau `AI_PROVIDER=openai`.

### 3. Migrasi & Seeding Data Demo
Jalankan migrasi dan demo data siap pakai:
```bash
php artisan migrate --seed --seeder=DemoSeeder
```

### 4. Build Frontend & Jalankan Server
```bash
npm run build
php artisan serve
```

Buka peramban di `http://localhost:8000`.

**Kredensial Demo:**
- Email: `admin@walead.test`
- Password: `password`

### 5. Jalankan Queue Worker & Scheduler (Penting!)

Proses AI (auto-reply WhatsApp) dan followup otomatis membutuhkan **queue worker** dan **scheduler** yang berjalan:

```bash
# Terminal 1 — queue worker (WAJIB untuk auto-reply AI & pemrosesan webhook)
php artisan queue:work redis

# Terminal 2 — scheduler (untuk followup otomatis tiap 5 menit)
php artisan schedule:work
```

> Di produksi, gunakan supervisor untuk queue worker dan cron `* * * * * php /path/to/artisan schedule:run` untuk scheduler.
>
> Saat pengembangan tanpa Redis, set `QUEUE_CONNECTION=sync` di `.env` agar job berjalan inline (tidak perlu worker).

---

## 🧪 Menjalankan Tes Otomatis
```bash
php artisan test
```

## 📖 Dokumentasi Lanjutan
- [System Architecture](docs/architecture.md)
- [WhatsApp Cloud API Integration](docs/whatsapp-integration.md)
- [AI Intelligence Layer](docs/ai-architecture.md)
- [Demo Mode & Customer Simulator](docs/demo-mode.md)
