<?php

namespace App\Services;

use App\Models\Conversation;
use App\Models\Followup;
use App\Models\Lead;
use App\Models\PendingAction;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class FollowUpService
{
    public function scanForAbandonedConversations()
    {
        // Find conversations inactive for more than 2 hours but less than 24 hours
        // Where the lead intent was a checkout or purchase intent
        $thresholdStart = Carbon::now()->subHours(24);
        $thresholdEnd = Carbon::now()->subHours(2);

        $conversations = Conversation::whereBetween('last_message_at', [$thresholdStart, $thresholdEnd])
            ->where('status', 'OPEN')
            ->whereHas('customer.leads', function ($q) {
                $q->whereIn('intent', ['checkout_intent', 'purchase_intent', 'product_inquiry']);
            })
            ->get();

        foreach ($conversations as $conversation) {
            $this->createRecoveryFollowUp($conversation);
        }
    }

    private function createRecoveryFollowUp(Conversation $conversation)
    {
        // Don't create if a follow-up was already created in the last 24 hours
        if (Followup::where('conversation_id', $conversation->id)
            ->where('created_at', '>=', Carbon::now()->subHours(24))
            ->exists()) {
            return;
        }

        $lead = $conversation->customer->leads()->latest()->first();

        $message = "Halo kak {$conversation->customer->name}, apakah ada yang bisa kami bantu lagi mengenai pesan sebelumnya? Kalau ada kendala, beritahu kami ya!";

        $followup = Followup::create([
            'workspace_id' => $conversation->workspace_id,
            'customer_id' => $conversation->customer_id,
            'conversation_id' => $conversation->id,
            'type' => 'RECOVERY',
            'message' => $message,
            'estimated_value' => $lead ? $lead->estimated_value : 0,
            'status' => 'PENDING',
        ]);

        PendingAction::create([
            'workspace_id' => $conversation->workspace_id,
            'agent_id' => 'ai_sales_agent',
            'action_type' => 'send_message',
            'payload' => [
                'conversation_id' => $conversation->id,
                'message' => $message,
                'followup_id' => $followup->id,
            ],
            'risk_level' => 'MEDIUM',
            'reason' => "Abandoned conversation recovery for {$conversation->customer->name}",
            'status' => 'PENDING',
        ]);

        Log::info("Created recovery follow up pending action for conversation {$conversation->id}");
    }
}
