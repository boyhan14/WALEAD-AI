<?php

namespace App\Services;

use App\Models\Conversation;
use App\Models\Followup;
use App\Models\PendingAction;
use App\Services\WhatsApp\WhatsAppProviderInterface;
use Illuminate\Support\Facades\Log;

class ActionExecutionService
{
    public function __construct(private WhatsAppProviderInterface $whatsapp) {}

    public function execute(PendingAction $action)
    {
        if ($action->status !== 'APPROVED') {
            Log::warning("Cannot execute action {$action->id} because status is {$action->status}");

            return false;
        }

        try {
            if ($action->action_type === 'send_message') {
                $payload = $action->payload;
                $conversation = Conversation::where('workspace_id', $action->workspace_id)
                    ->find($payload['conversation_id']);
                if (! $conversation) {
                    return false;
                }

                // Send via WhatsApp
                $result = $this->whatsapp->sendMessage($conversation->channel, $conversation->customer->phone, $payload['message']);

                if (! $result['success']) {
                    Log::error('Failed to send WhatsApp message via provider: '.($result['error'] ?? 'Unknown error'));
                    // Note: Could return false here or still create the message with FAILED status
                }

                // Persist
                $conversation->messages()->create([
                    'workspace_id' => $conversation->workspace_id,
                    'sender_user_id' => $action->approved_by, // Or null to indicate AI
                    'message_type' => 'TEXT',
                    'content' => $payload['message'],
                    'direction' => 'OUTBOUND',
                    'is_ai_generated' => true,
                    'provider_message_id' => $result['message_id'] ?? null,
                    'provider_status' => $result['success'] ? 'SENT' : 'FAILED',
                    'metadata' => isset($result['error']) ? ['error' => $result['error']] : null,
                ]);

                if (isset($payload['followup_id'])) {
                    $followup = Followup::where('workspace_id', $action->workspace_id)
                        ->find($payload['followup_id']);
                    if ($followup) {
                        $followup->update([
                            'status' => 'SENT',
                            'sent_at' => now(),
                        ]);
                    }
                }
            }

            return true;
        } catch (\Exception $e) {
            Log::error("Failed to execute action {$action->id}: ".$e->getMessage());

            return false;
        }
    }
}
