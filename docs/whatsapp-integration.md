# WhatsApp Business Platform Integration

## Overview

WALEAD AI mendukung integrasi resmi dengan **Meta WhatsApp Business Platform / Cloud API** dan menyediakan **Mock WhatsApp Provider** untuk pengembangan lokal tanpa dependensi eksternal.

## Endpoints

- `GET /api/webhooks/whatsapp`: Webhook verification challenge dari Meta (`hub.challenge`).
- `POST /api/webhooks/whatsapp`: Webhook event receiver untuk pesan masuk dan status pengiriman.

## Providers Abstraction

Semua interaksi WhatsApp diatur melalui antarmuka:
`App\Services\WhatsApp\WhatsAppProviderInterface`

1. **MetaWhatsAppProvider**: Mengirimkan pesan via Graph API (`https://graph.facebook.com/v19.0/{phone_number_id}/messages`).
2. **MockWhatsAppProvider**: Mensimulasikan pengiriman pesan dengan logging lokal, aktif saat `WHATSAPP_PROVIDER=mock`.

## Developer Simulator

Gunakan menu **Customer Simulator** di aplikasi (`/simulator`) untuk mensimulasikan pesan masuk dari pelanggan tanpa membutuhkan akun Meta aktif.
