<?php

namespace App\Jobs;

use App\Models\Channel;
use App\Services\WhatsApp\WhatsAppWebhookProcessor;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class ProcessWhatsAppWebhook implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public function __construct(
        public int $channelId,
        public array $payload,
    ) {}

    public function handle(WhatsAppWebhookProcessor $processor): void
    {
        $channel = Channel::query()
            ->withoutGlobalScopes()
            ->find($this->channelId);

        if (! $channel) {
            Log::warning('WhatsApp webhook job skipped: channel not found', [
                'channel_id' => $this->channelId,
            ]);

            return;
        }

        $processor->process($this->payload, $channel);
    }
}
