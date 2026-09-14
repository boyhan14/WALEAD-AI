<?php

namespace App\Services\AI;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiProvider implements AIProviderInterface
{
    /**
     * @var array<int, string>
     */
    private array $models;

    /**
     * @param  array<int, string>  $fallbackModels
     */
    public function __construct(
        private string $apiKey,
        string $model = 'gemini-3.6-flash',
        private string $baseUrl = 'https://generativelanguage.googleapis.com/v1beta',
        array $fallbackModels = [],
    ) {
        $this->models = array_values(array_unique(array_filter([$model, ...$fallbackModels])));
    }

    /**
     * Get candidate models in fallback order.
     *
     * @return array<int, string>
     */
    public function getModels(): array
    {
        return $this->models;
    }

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

    /**
     * Send HTTP request with automatic fallback to next models upon failure.
     */
    private function post(string $endpoint, array $payload): Response
    {
        $lastException = null;
        $lastStatus = 500;

        foreach ($this->models as $index => $candidateModel) {
            try {
                $response = Http::withHeaders(['x-goog-api-key' => $this->apiKey])
                    ->timeout(25)
                    ->retry(2, 500, throw: false)
                    ->post("{$this->baseUrl}/models/{$candidateModel}:{$endpoint}", $payload);

                if ($response->successful()) {
                    if ($index > 0) {
                        Log::info("Gemini fallback succeeded using model [{$candidateModel}] after prior model failed.");
                    }

                    return $response;
                }

                $lastStatus = $response->status();
                Log::warning("Gemini model [{$candidateModel}] failed with HTTP status {$lastStatus}", [
                    'endpoint' => $endpoint,
                    'error' => $response->json('error.message') ?? $response->body(),
                ]);
            } catch (ConnectionException $e) {
                $lastException = $e;
                Log::warning("Gemini model [{$candidateModel}] connection error: {$e->getMessage()}");
            } catch (\Throwable $e) {
                $lastException = $e;
                Log::warning("Gemini model [{$candidateModel}] error: {$e->getMessage()}");
            }
        }

        if ($lastException instanceof ConnectionException) {
            throw AIProviderException::unreachable('gemini', $lastException);
        }

        throw AIProviderException::requestFailed('gemini', $lastStatus);
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
        } catch (\Throwable $e) {
            Log::error('Gemini jsonRequest failed across all models', ['error' => $e->getMessage()]);

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
