<?php

namespace App\Services\WhatsApp;

use App\Models\Channel;

class ChannelAwareWhatsAppProvider implements WhatsAppProviderInterface
{
    public function __construct(
        private MetaWhatsAppProvider $meta,
        private MockWhatsAppProvider $mock,
    ) {}

    public function sendMessage(Channel $channel, string $to, string $message, array $options = []): array
    {
        return $this->providerFor($channel)->sendMessage($channel, $to, $message, $options);
    }

    public function verifyWebhook(array $payload, string $signature, Channel $channel): bool
    {
        return $this->providerFor($channel)->verifyWebhook($payload, $signature, $channel);
    }

    public function validateConnection(Channel $channel): array
    {
        return $this->providerFor($channel)->validateConnection($channel);
    }

    private function providerFor(Channel $channel): WhatsAppProviderInterface
    {
        return ($channel->config['provider'] ?? config('services.whatsapp.provider')) === 'meta'
            ? $this->meta
            : $this->mock;
    }
}
