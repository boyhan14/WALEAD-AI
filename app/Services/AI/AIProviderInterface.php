<?php

namespace App\Services\AI;

interface AIProviderInterface
{
    public function generateResponse(array $context, string $prompt): string;

    public function analyzeIntent(string $message): array;

    public function scoreLead(array $conversationHistory): int;
}
