<?php

namespace App\Services\WhatsApp;

use App\Models\Channel;
use Illuminate\Support\Facades\Log;

class MockWhatsAppProvider implements WhatsAppProviderInterface
{
    public function sendMessage(Channel $channel, string $to, string $message, array $options = []): array
    {
        Log::info("Mock WhatsApp sent message to {$to}: {$message}");

        return [
            'success' => true,
            'message_id' => 'mock_'.uniqid(),
            'error' => null,
        ];
    }

    public function verifyWebhook(array $payload, string $signature, Channel $channel): bool
    {
        return true;
    }

    public function validateConnection(Channel $channel): array
    {
        return ['success' => true, 'error' => null];
    }
}
