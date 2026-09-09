<?php

use App\Http\Controllers\Api\WhatsAppWebhookController;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:60,1')->group(function () {
    Route::get('/webhooks/whatsapp/{channel}', [WhatsAppWebhookController::class, 'verify']);
    Route::post('/webhooks/whatsapp/{channel}', [WhatsAppWebhookController::class, 'handle']);
});
