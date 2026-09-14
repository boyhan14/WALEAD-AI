<?php

namespace Tests\Unit;

use App\Services\AI\AIProviderException;
use App\Services\AI\GeminiProvider;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class GeminiProviderTest extends TestCase
{
    public function test_it_registers_ordered_models_with_fallbacks(): void
    {
        $provider = new GeminiProvider(
            apiKey: 'test-key',
            model: 'gemini-3.6-flash',
            fallbackModels: ['gemini-3.7-flash', 'gemini-3.8-flash', 'gemini-3.6-flash'],
        );

        // Deduplicated and in order: primary model first, followed by unique fallbacks
        $this->assertSame(['gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-3.8-flash'], $provider->getModels());
    }

    public function test_it_uses_primary_model_when_successful(): void
    {
        Http::fake([
            '*/models/gemini-3.6-flash:generateContent' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [['text' => 'Halo dari 3.6 flash!']],
                        ],
                    ],
                ],
            ], 200),
        ]);

        $provider = new GeminiProvider(
            apiKey: 'test-key',
            model: 'gemini-3.6-flash',
            fallbackModels: ['gemini-3.7-flash'],
        );

        $response = $provider->generateResponse([], 'Halo');

        $this->assertSame('Halo dari 3.6 flash!', $response);
        Http::assertSentCount(1);
    }

    public function test_it_falls_back_to_next_model_when_primary_fails(): void
    {
        Http::fake([
            // Primary model returns 503 Overloaded
            '*/models/gemini-3.6-flash:generateContent' => Http::response([
                'error' => ['message' => 'The model is overloaded.'],
            ], 503),
            // Fallback model returns 200 OK
            '*/models/gemini-3.7-flash:generateContent' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [['text' => 'Halo dari fallback 3.7 flash!']],
                        ],
                    ],
                ],
            ], 200),
        ]);

        $provider = new GeminiProvider(
            apiKey: 'test-key',
            model: 'gemini-3.6-flash',
            fallbackModels: ['gemini-3.7-flash'],
        );

        $response = $provider->generateResponse([], 'Halo');

        $this->assertSame('Halo dari fallback 3.7 flash!', $response);
    }

    public function test_it_throws_exception_when_all_models_fail(): void
    {
        Http::fake([
            '*/models/gemini-3.6-flash:generateContent' => Http::response(['error' => 'fail'], 503),
            '*/models/gemini-3.7-flash:generateContent' => Http::response(['error' => 'fail'], 500),
        ]);

        $provider = new GeminiProvider(
            apiKey: 'test-key',
            model: 'gemini-3.6-flash',
            fallbackModels: ['gemini-3.7-flash'],
        );

        $this->expectException(AIProviderException::class);

        $provider->generateResponse([], 'Halo');
    }
}
