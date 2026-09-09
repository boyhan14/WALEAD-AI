<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\Lead;
use App\Models\LeadEvent;
use App\Models\LeadScore;

class LeadScoringService
{
    public function recordEvent(Customer $customer, string $type, array $metadata = []): void
    {
        $workspaceId = $customer->workspace_id;

        $lead = Lead::firstOrCreate(
            ['workspace_id' => $workspaceId, 'customer_id' => $customer->id],
            ['score' => 0, 'temperature' => 'COLD', 'status' => 'OPEN', 'last_activity_at' => now()]
        );

        $delta = $this->calculateDelta($type);

        LeadEvent::create([
            'lead_id' => $lead->id,
            'type' => $type,
            'score_delta' => $delta,
            'metadata' => $metadata,
        ]);

        $newScore = min(100, max(0, $lead->score + $delta));
        $temperature = $this->determineTemperature($newScore);

        $lead->update([
            'score' => $newScore,
            'temperature' => $temperature,
            'last_activity_at' => now(),
        ]);

        LeadScore::create([
            'lead_id' => $lead->id,
            'score' => $newScore,
            'reason' => "Triggered by event: $type",
        ]);
    }

    private function calculateDelta(string $type): int
    {
        return match ($type) {
            'product_inquiry' => 20,
            'price_inquiry' => 15,
            'checkout_intent' => 30,
            'purchase_completed' => 50,
            'complaint' => -10,
            'abandoned_conversation' => -5,
            default => 5,
        };
    }

    private function determineTemperature(int $score): string
    {
        if ($score >= 80) {
            return 'VERY_HOT';
        }
        if ($score >= 60) {
            return 'HOT';
        }
        if ($score >= 30) {
            return 'WARM';
        }

        return 'COLD';
    }
}
