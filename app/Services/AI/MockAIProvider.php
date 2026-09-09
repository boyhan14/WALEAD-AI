<?php

namespace App\Services\AI;

use Illuminate\Support\Facades\Log;

class MockAIProvider implements AIProviderInterface
{
    public function generateResponse(array $context, string $prompt): string
    {
        Log::info("Mock AI generating response for: $prompt");

        return "This is a mock AI response. (Prompt was: $prompt)";
    }

    public function analyzeIntent(string $message): array
    {
        return [
            'intent' => 'product_inquiry',
            'confidence' => 0.85,
        ];
    }

    public function scoreLead(array $conversationHistory): int
    {
        return 75; // Mock score
    }
}
