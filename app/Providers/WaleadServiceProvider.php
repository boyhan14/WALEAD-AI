<?php

namespace App\Providers;

use App\Services\AI\AIProviderException;
use App\Services\AI\AIProviderInterface;
use App\Services\AI\GeminiProvider;
use App\Services\AI\MockAIProvider;
use App\Services\AI\OpenAIProvider;
use App\Services\WhatsApp\ChannelAwareWhatsAppProvider;
use App\Services\WhatsApp\MetaWhatsAppProvider;
use App\Services\WhatsApp\MockWhatsAppProvider;
use App\Services\WhatsApp\WhatsAppProviderInterface;
use Illuminate\Support\ServiceProvider;

class WaleadServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(WhatsAppProviderInterface::class, function ($app) {
            return new ChannelAwareWhatsAppProvider(new MetaWhatsAppProvider, new MockWhatsAppProvider);
        });

        $this->app->bind(AIProviderInterface::class, function () {
            return match (config('ai.driver', 'mock')) {
                'openai' => new OpenAIProvider(
                    apiKey: $this->requireApiKey('openai'),
                    model: config('ai.openai.model'),
                    baseUrl: config('ai.openai.base_url'),
                ),
                'gemini' => new GeminiProvider(
                    apiKey: $this->requireApiKey('gemini'),
                    model: config('ai.gemini.model'),
                    baseUrl: config('ai.gemini.base_url'),
                    fallbackModels: config('ai.gemini.fallback_models', []),
                ),
                default => new MockAIProvider,
            };
        });
    }

    private function requireApiKey(string $provider): string
    {
        $apiKey = config("ai.{$provider}.api_key");

        if (empty($apiKey)) {
            throw AIProviderException::missingApiKey($provider);
        }

        return $apiKey;
    }
}
