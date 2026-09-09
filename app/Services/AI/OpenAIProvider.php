<?php

namespace App\Services\AI;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenAIProvider implements AIProviderInterface
{
    public function __construct(
        private string $apiKey,
        private string $model = 'gpt-4o-mini',
        private string $baseUrl = 'https://api.openai.com/v1',
    ) {}

    public function generateResponse(array $context, string $prompt): string
    {
        $messages = [
            ['role' => 'system', 'content' => $this->buildSystemPrompt($context)],
            ['role' => 'user', 'content' => $prompt],
        ];

        try {
            $response = Http::withToken($this->apiKey)
                ->timeout(30)
                ->post("{$this->baseUrl}/chat/completions", [
                    'model' => $this->model,
                    'messages' => $messages,
                    'temperature' => 0.7,
                    'max_tokens' => 500,
                ]);

            if ($response->failed()) {
                Log::error('OpenAI generateResponse failed', ['status' => $response->status()]);

                throw AIProviderException::requestFailed('openai', $response->status());
            }

            return trim($response->json('choices.0.message.content', ''));
        } catch (ConnectionException $e) {
            Log::error('OpenAI connection error', ['error' => $e->getMessage()]);

            throw AIProviderException::unreachable('openai', $e);
        }
    }

    public function analyzeIntent(string $message): array
    {
        $systemPrompt = <<<'PROMPT'
            You classify WhatsApp customer messages for an Indonesian e-commerce business.
            Respond ONLY with a JSON object: {"intent": one of "price_inquiry", "checkout_intent",
            "product_inquiry", "availability_inquiry", "complaint", "greeting", "other"},
            "confidence": a float between 0 and 1.
            PROMPT;

        $data = $this->jsonCompletion($systemPrompt, $message);

        return [
            'intent' => $data['intent'] ?? 'other',
            'confidence' => (float) ($data['confidence'] ?? 0.5),
        ];
    }

    public function scoreLead(array $conversationHistory): int
    {
        $transcript = collect($conversationHistory)
            ->map(fn ($entry) => ($entry['role'] ?? 'unknown').': '.($entry['content'] ?? ''))
            ->implode("\n");

        $systemPrompt = <<<'PROMPT'
            You score sales leads based on a WhatsApp conversation transcript for an Indonesian
            e-commerce business. Respond ONLY with a JSON object: {"score": an integer between
            0 and 100} where 0 is cold and 100 is ready to buy.
            PROMPT;

        $data = $this->jsonCompletion($systemPrompt, $transcript);

        return (int) min(100, max(0, $data['score'] ?? 0));
    }

    private function jsonCompletion(string $systemPrompt, string $userContent): array
    {
        try {
            $response = Http::withToken($this->apiKey)
                ->timeout(30)
                ->post("{$this->baseUrl}/chat/completions", [
                    'model' => $this->model,
                    'messages' => [
                        ['role' => 'system', 'content' => $systemPrompt],
                        ['role' => 'user', 'content' => $userContent],
                    ],
                    'temperature' => 0.1,
                    'response_format' => ['type' => 'json_object'],
                ]);

            if ($response->failed()) {
                Log::error('OpenAI jsonCompletion failed', ['status' => $response->status()]);

                return [];
            }

            $decoded = json_decode((string) $response->json('choices.0.message.content', '{}'), true);

            return is_array($decoded) ? $decoded : [];
        } catch (ConnectionException $e) {
            Log::error('OpenAI connection error', ['error' => $e->getMessage()]);

            return [];
        }
    }

    private function buildSystemPrompt(array $context): string
    {
        $businessName = $context['business_name'] ?? 'the business';
        $history = collect($context['history'] ?? [])
            ->map(fn ($entry) => ($entry['role'] ?? 'unknown').': '.($entry['content'] ?? ''))
            ->implode("\n");

        return "You are a helpful WhatsApp sales assistant for {$businessName}, an Indonesian "
            .'small business. Reply in the same language the customer uses (mostly Bahasa Indonesia). '
            ."Be concise and friendly.\n\nConversation history:\n{$history}";
    }
}
