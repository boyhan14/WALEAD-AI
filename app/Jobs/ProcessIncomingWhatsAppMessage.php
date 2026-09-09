<?php

namespace App\Jobs;

use App\Models\Conversation;
use App\Services\AICustomerService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessIncomingWhatsAppMessage implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public int $conversationId,
        public string $messageBody
    ) {}

    public function handle(AICustomerService $aiService): void
    {
        $conversation = Conversation::find($this->conversationId);
        if (! $conversation) {
            return;
        }

        $aiService->processIncomingMessage($conversation, $this->messageBody);
    }
}
