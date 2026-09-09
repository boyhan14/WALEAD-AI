# WALEAD AI — System Architecture

## Overview

WALEAD AI adalah **AI Revenue Recovery & Sales Automation OS** yang dirancang khusus untuk bisnis berbasis percakapan WhatsApp (UMKM, online sellers, retail, dll).

## Core Architectural Pillars

### 1. Multi-Tenancy & Tenant Isolation
- Setiap resource milik tenant memiliki kolom `workspace_id`.
- Model menggunakan trait `App\Models\Traits\BelongsToWorkspace` yang mengaplikasikan global scope `App\Models\Scopes\WorkspaceScope`.
- Scope mengunci setiap query database agar hanya mengakses data milik `current_workspace_id` user yang sedang terotentikasi.
- Pivot table `workspace_user` menghubungkan User dengan Workspace beserta Role (OWNER, ADMIN, AGENT).

### 2. Omnichannel Conversation Engine
- **Channels**: Abstraksi kanal percakapan (WhatsApp, Web, dll) per workspace dengan kredensial terenkripsi.
- **Conversations**: Sesi percakapan antara pelanggan dengan bisnis.
- **Messages**: Riwayat pesan masuk (`INBOUND`) dan keluar (`OUTBOUND`).
- **Attachments**: Media gambar, dokumen, atau audio.

### 3. Lead Intelligence & Scoring
- **IntentDetectionService**: Mengklasifikasi intensi pesan secara deterministik atau berbasis AI (`product_inquiry`, `price_inquiry`, `checkout_intent`, `complaint`, dll).
- **LeadScoringService**: Mengakumulasi skor (0-100) dan menentukan suhu lead (`COLD`, `WARM`, `HOT`, `VERY_HOT`).
- **LeadEvent**: Audit trail perubahan skor per event percakapan.

### 4. Human-In-The-Loop (HITL) Safety
- Aksi berisiko menengah/tinggi yang disarankan AI (seperti memberikan diskon khusus, eskalasi komplain, penawaran harga) dimasukkan ke tabel `pending_actions`.
- Pengguna dapat me-review, menyetujui (`APPROVED`), atau menolak (`REJECTED`) di **AI Approval Center**.
- Setelah disetujui, `ActionExecutionService` mengirimkan pesan ke pelanggan via WhatsApp Provider.
