<?php

namespace App\Services\WhatsApp;

use App\Models\Channel;

interface WhatsAppProviderInterface
{
    public function sendMessage(Channel $channel, string $to, string $message, array $options = []): array;

    public function verifyWebhook(array $payload, string $signature, Channel $channel): bool;

    public function validateConnection(Channel $channel): array;
}
