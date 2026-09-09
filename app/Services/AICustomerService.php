<?php

namespace App\Services;

use App\Models\Conversation;
use App\Models\PendingAction;
use App\Services\AI\AIProviderInterface;
use App\Services\WhatsApp\WhatsAppProviderInterface;
use Illuminate\Support\Facades\Log;

class AICustomerService
{
    public function __construct(private AIProviderInterface $ai) {}

    public function processIncomingMessage(Conversation $conversation, string $messageBody)
    {
        $intentService = app(IntentDetectionService::class);
        $intentResult = $intentService->detect($messageBody);

        $scoringService = app(LeadScoringService::class);
        $scoringService->recordEvent($conversation->customer, $intentResult['intent']);

        $context = [
            'customer_name' => $conversation->customer->name,
            'intent' => $intentResult['intent'],
            // would pull from knowledge base and products in real version
        ];

        try {
            $suggestedReply = $this->ai->generateResponse($context, $messageBody);
        } catch (\Throwable $e) {
            Log::error('AI Provider Failed: '.$e->getMessage());
            $suggestedReply = 'Mohon maaf, sistem otomatis kami sedang sibuk. Tim kami akan segera membalas pesan Anda.';
            // Force it to high risk so a human takes over
            $intentResult['intent'] = 'human_escalation';
        }

        $riskLevel = $this->determineRisk($intentResult['intent']);

        if ($riskLevel === 'LOW') {
            // Auto reply
            $whatsapp = app(WhatsAppProviderInterface::class);
            $result = $whatsapp->sendMessage($conversation->channel, $conversation->customer->phone, $suggestedReply);

            if (! $result['success']) {
                Log::error('Failed to auto-reply via provider: '.($result['error'] ?? 'Unknown error'));
            }

            $conversation->messages()->create([
                'workspace_id' => $conversation->workspace_id,
                'sender_user_id' => null,
                'message_type' => 'TEXT',
                'content' => $suggestedReply,
                'direction' => 'OUTBOUND',
                'is_ai_generated' => true,
                'provider_message_id' => $result['message_id'] ?? null,
                'provider_status' => $result['success'] ? 'SENT' : 'FAILED',
                'metadata' => isset($result['error']) ? ['error' => $result['error']] : null,
            ]);
            $conversation->update(['last_message_at' => now()]);
        } else {
            // Require human approval
            PendingAction::create([
                'workspace_id' => $conversation->workspace_id,
                'agent_id' => 'ai_sales_agent',
                'action_type' => 'send_message',
                'payload' => [
                    'conversation_id' => $conversation->id,
                    'message' => $suggestedReply,
                ],
                'risk_level' => $riskLevel,
                'reason' => "Detected intent: {$intentResult['intent']} with confidence {$intentResult['confidence']}",
                'status' => 'PENDING',
            ]);
        }
    }

    private function determineRisk(string $intent): string
    {
        return match ($intent) {
            'complaint', 'refund_request', 'human_escalation' => 'HIGH',
            'checkout_intent' => 'MEDIUM',
            default => 'LOW',
        };
    }
}
