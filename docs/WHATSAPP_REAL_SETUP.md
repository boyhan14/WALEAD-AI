# WALEAD AI — Real WhatsApp Business Cloud API Setup Guide

## Overview

WALEAD AI supports two WhatsApp providers:
- **`mock`** — Development/testing mode. No real credentials needed. Used by the Customer Simulator.
- **`meta`** — Real Meta WhatsApp Business Cloud API. For production and live testing.

---

## Prerequisites

Before you can use the real Meta integration, you need:

1. A **Meta Developer account** — [developers.facebook.com](https://developers.facebook.com)
2. A **WhatsApp Business Account (WABA)**
3. A **Meta App** with WhatsApp product enabled
4. A **test phone number** (provided by Meta in the Developer Console, or your own verified business number)
5. A **public HTTPS URL** for your webhook (see Local Testing section below)

---

## Step 1: Create a Meta Developer App

1. Go to [developers.facebook.com/apps](https://developers.facebook.com/apps)
2. Click **Create App**
3. Choose **Business** type
4. Fill in app name and contact email
5. Under **Add products**, click **Set up** next to **WhatsApp**

---

## Step 2: Obtain Credentials

From the WhatsApp > API Setup page in your Meta App:

| Credential | Where to find it |
|---|---|
| `WHATSAPP_ACCESS_TOKEN` | "Temporary access token" on API Setup page |
| `WHATSAPP_PHONE_NUMBER_ID` | "Phone number ID" on API Setup page |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | "WhatsApp Business Account ID" on API Setup page |
| `WHATSAPP_APP_SECRET` | App Settings > Basic > App Secret |
| `WHATSAPP_VERIFY_TOKEN` | Any random secure string you choose |

> **IMPORTANT:** The temporary access token expires in 24 hours. For production, generate a permanent token via System Users.

---

## Step 3: Configure .env

```env
WHATSAPP_PROVIDER=meta
WHATSAPP_API_VERSION=v20.0
WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxx
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_BUSINESS_ACCOUNT_ID=987654321098765
WHATSAPP_VERIFY_TOKEN=walead_your_random_secret_here
WHATSAPP_APP_SECRET=abcdef1234567890abcdef1234567890
```

---

## Step 4: Configure HTTPS Webhook (Local Development)

Meta requires a **public HTTPS URL** to deliver webhook events. For local development, use a tunnel:

### Option A: ngrok (recommended)

```bash
# Install ngrok: https://ngrok.com/download
ngrok http 8000
```

This gives you a URL like: `https://abc123.ngrok-free.app`

Your webhook URL will be:
```
https://abc123.ngrok-free.app/api/webhooks/whatsapp/{channel_id}
```

### Option B: Cloudflare Tunnel

```bash
cloudflared tunnel --url http://localhost:8000
```

### Option C: Expose.dev

```bash
expose share http://localhost:8000
```

> Set `APP_URL=https://your-tunnel-url.ngrok-free.app` in your `.env` if needed.

---

## Step 5: Configure the WhatsApp Channel in WALEAD

1. Log into your WALEAD workspace
2. Go to **Settings → WhatsApp Integration**
3. Select **Meta WhatsApp Cloud API** as provider
4. Enter your Phone Number ID, Access Token, and App Secret
5. Click **Save Configuration**
6. Note the **Webhook URL** shown on the page (e.g., `https://yourapp.com/api/webhooks/whatsapp/1`)

---

## Step 6: Register the Webhook in Meta

1. In your Meta App, go to **WhatsApp → Configuration**
2. Under **Webhook**, click **Edit**
3. Enter:
   - **Callback URL**: your WALEAD webhook URL
   - **Verify token**: the value from `WHATSAPP_VERIFY_TOKEN`
4. Click **Verify and Save**
5. Under **Webhook fields**, subscribe to:
   - `messages`
   - `message_status`

---

## Step 7: Start Laravel and Queue Worker

```bash
# Terminal 1: Start Laravel
php artisan serve

# Terminal 2: Start queue worker (required for AI processing)
php artisan queue:work --tries=3

# Terminal 3 (optional): Your tunnel
ngrok http 8000
```

---

## Step 8: Send a Test Message

1. From your personal WhatsApp, send a message to the **test phone number**
2. Check the WALEAD **Inbox** — the message should appear in real time
3. The AI will process the message and create a **Pending Action** (or auto-reply)
4. Approve the action to send a real reply back to your phone

---

## Step 9: Verify the Full Flow

| Step | Expected result |
|---|---|
| Send message from phone | Message appears in WALEAD Inbox |
| Customer lookup | Customer auto-created or matched in CRM |
| Lead scoring | Lead score updated, intent detected |
| AI processing | Suggested reply generated, Pending Action created |
| Approve in WALEAD | Reply sent via Meta Cloud API |
| Check your phone | Reply arrives in WhatsApp |
| Status webhook | Message status updates to Delivered → Read |

---

## Security Notes

- **Never** commit your Access Token or App Secret to git
- **Always** validate the `X-Hub-Signature-256` header on incoming webhooks (WALEAD does this automatically when `WHATSAPP_PROVIDER=meta`)
- The `WHATSAPP_VERIFY_TOKEN` is used only for webhook verification, not message signing
- Credentials entered via the Settings UI are stored encrypted in the `channels.credentials` JSON column

---

## Switching Between Mock and Real

```env
# Development / testing
WHATSAPP_PROVIDER=mock

# Real Meta API
WHATSAPP_PROVIDER=meta
```

Or configure per-channel via the Settings UI — each channel can have its own credentials.

---

## LIVE TEST STATUS

```
LIVE META E2E: NOT TESTED
REASON: Real Meta credentials and a public HTTPS webhook URL are required.
        Configure per the steps above to run a live test.
```

To confirm a successful live test, you should see:
1. Real message received in WALEAD Inbox from your phone
2. AI suggested reply in Pending Actions
3. On approval, reply delivered to your phone via WhatsApp
4. Message status updating from SENT → DELIVERED → READ in the WALEAD database
