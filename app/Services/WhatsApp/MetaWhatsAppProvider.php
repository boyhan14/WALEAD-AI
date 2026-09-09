<?php

namespace App\Services\WhatsApp;

use App\Models\Channel;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MetaWhatsAppProvider implements WhatsAppProviderInterface
{
    public function sendMessage(Channel $channel, string $to, string $message, array $options = []): array
    {
        $token = $channel->credentials['access_token'] ?? config('services.whatsapp.access_token');
        $phoneId = $channel->credentials['phone_number_id'] ?? config('services.whatsapp.phone_number_id');
        $apiVersion = $channel->config['api_version'] ?? config('services.whatsapp.api_version', 'v20.0');

        if (! $token || ! $phoneId) {
            Log::error('WhatsApp credentials missing for channel '.$channel->id);

            return ['success' => false, 'error' => 'Credentials missing'];
        }

        $payload = [
            'messaging_product' => 'whatsapp',
            'to' => $to,
            'type' => 'text',
            'text' => ['body' => $message],
        ];

        // Handle other types if passed in options
        if (isset($options['type']) && $options['type'] !== 'text') {
            $payload['type'] = $options['type'];
            unset($payload['text']);

            if ($options['type'] === 'image' && isset($options['image'])) {
                $payload['image'] = $options['image']; // e.g. ['link' => 'url'] or ['id' => 'id']
            } elseif ($options['type'] === 'document' && isset($options['document'])) {
                $payload['document'] = $options['document'];
            } elseif ($options['type'] === 'template' && isset($options['template'])) {
                $payload['template'] = $options['template'];
            }
        }

        try {
            $response = Http::withToken($token)
                ->timeout(15) // prevent hanging
                ->post("https://graph.facebook.com/{$apiVersion}/{$phoneId}/messages", $payload);

            return [
                'success' => $response->successful(),
                'message_id' => $response->json('messages.0.id'),
                'error' => $response->json('error.message'),
            ];
        } catch (\Exception $e) {
            Log::error('WhatsApp API Request Failed: '.$e->getMessage());

            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    public function verifyWebhook(array $payload, string $signature, Channel $channel): bool
    {
        // Verified in the controller before passing here
        return true;
    }

    public function validateConnection(Channel $channel): array
    {
        $token = $channel->credentials['access_token'] ?? config('services.whatsapp.access_token');
        $phoneId = $channel->credentials['phone_number_id'] ?? config('services.whatsapp.phone_number_id');
        $apiVersion = $channel->config['api_version'] ?? config('services.whatsapp.api_version', 'v20.0');

        if (! $token || ! $phoneId) {
            return ['success' => false, 'error' => 'Credentials missing'];
        }

        try {
            $response = Http::withToken($token)
                ->timeout(15)
                ->get("https://graph.facebook.com/{$apiVersion}/{$phoneId}");

            return [
                'success' => $response->successful(),
                'error' => $response->successful() ? null : ($response->json('error.message') ?? 'Connection rejected'),
            ];
        } catch (\Exception $e) {
            return ['success' => false, 'error' => 'Connection failed'];
        }
    }
}
