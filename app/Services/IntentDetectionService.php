<?php

namespace App\Services;

use App\Services\AI\AIProviderInterface;

class IntentDetectionService
{
    public function __construct(private AIProviderInterface $ai) {}

    public function detect(string $message): array
    {
        // Simple heuristic fallback if AI is mock or down
        $messageLower = strtolower($message);

        if (str_contains($messageLower, 'harga') || str_contains($messageLower, 'berapa')) {
            return ['intent' => 'price_inquiry', 'confidence' => 0.9];
        }

        if (str_contains($messageLower, 'pesan') || str_contains($messageLower, 'beli') || str_contains($messageLower, 'checkout')) {
            return ['intent' => 'checkout_intent', 'confidence' => 0.95];
        }

        if (str_contains($messageLower, 'ready') || str_contains($messageLower, 'ada')) {
            return ['intent' => 'availability_inquiry', 'confidence' => 0.85];
        }

        // Call real AI Provider abstraction
        return $this->ai->analyzeIntent($message);
    }
}
