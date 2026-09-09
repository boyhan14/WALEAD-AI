<?php

namespace App\Services\AI;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiProvider implements AIProviderInterface
{
    public function __construct(
        private string $apiKey,
        private string $model = 'gemini-3.6-flash',
        private string $baseUrl = 'https://generativelanguage.googleapis.com/v1beta',
    ) {}

    public function generateResponse(array $context, string $prompt): string
    {
        $systemPrompt = $this->buildSystemPrompt($context);

        try {
            $response = $this->post('generateContent', [
                'systemInstruction' => [
                    'parts' => [['text' => $systemPrompt]],
                ],
                'contents' => [
                    ['role' => 'user', 'parts' => [['text' => $prompt]]],
                ],
                'generationConfig' => [
                    'temperature' => 0.7,
                    'maxOutputTokens' => 500,
                ],
            ]);

            return trim($response->json('candidates.0.content.parts.0.text', ''));
        } catch (ConnectionException $e) {
            Log::error('Gemini connection error', ['error' => $e->getMessage()]);

            throw AIProviderException::unreachable('gemini', $e);
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

        $data = $this->jsonRequest($systemPrompt, $message);

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

        $data = $this->jsonRequest($systemPrompt, $transcript);

        return (int) min(100, max(0, $data['score'] ?? 0));
    }

    private function post(string $endpoint, array $payload)
    {
        $response = Http::withHeaders(['x-goog-api-key' => $this->apiKey])
            ->timeout(30)
            ->post("{$this->baseUrl}/models/{$this->model}:{$endpoint}", $payload);

        if ($response->failed()) {
            Log::error('Gemini request failed', [
                'endpoint' => $endpoint,
                'status' => $response->status(),
            ]);

            throw AIProviderException::requestFailed('gemini', $response->status());
        }

        return $response;
    }

    private function jsonRequest(string $systemPrompt, string $userContent): array
    {
        try {
            $response = $this->post('generateContent', [
                'systemInstruction' => [
                    'parts' => [['text' => $systemPrompt]],
                ],
                'contents' => [
                    ['role' => 'user', 'parts' => [['text' => $userContent]]],
                ],
                'generationConfig' => [
                    'temperature' => 0.1,
                    'responseMimeType' => 'application/json',
                ],
            ]);

            $decoded = json_decode((string) $response->json('candidates.0.content.parts.0.text', '{}'), true);

            return is_array($decoded) ? $decoded : [];
        } catch (ConnectionException $e) {
            Log::error('Gemini connection error', ['error' => $e->getMessage()]);

            return [];
        } catch (\Throwable $e) {
            Log::error('Gemini request failed', ['error' => $e->getMessage()]);

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
