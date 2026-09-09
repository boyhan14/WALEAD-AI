<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessWhatsAppWebhook;
use App\Models\Channel;
use App\Models\Scopes\WorkspaceScope;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WhatsAppWebhookController extends Controller
{
    public function verify(Request $request, $channelId)
    {
        // Find channel bypassing tenant scope since this is unauthenticated
        $channel = Channel::withoutGlobalScope(WorkspaceScope::class)->findOrFail($channelId);

        $mode = $request->query('hub_mode');
        $token = $request->query('hub_verify_token');
        $challenge = $request->query('hub_challenge');

        // Check against the channel's specific verify token
        $expectedToken = $channel->webhook_secret ?? config('services.whatsapp.verify_token');

        if ($mode === 'subscribe' && $token === $expectedToken) {
            return response($challenge, 200);
        }

        return response('Forbidden', 403);
    }

    public function handle(Request $request, $channelId)
    {
        $channel = Channel::withoutGlobalScope(WorkspaceScope::class)->findOrFail($channelId);

        // Signature Validation for Meta
        if (config('services.whatsapp.provider') === 'meta' || ($channel->config['provider'] ?? '') === 'meta') {
            $signature = $request->header('x-hub-signature-256');
            $appSecret = $channel->credentials['app_secret'] ?? config('services.whatsapp.app_secret');

            if (! $signature || ! $appSecret) {
                return response('Missing signature or app secret', 403);
            }

            $expectedSignature = 'sha256='.hash_hmac('sha256', $request->getContent(), $appSecret);
            if (! hash_equals($expectedSignature, $signature)) {
                Log::warning('WhatsApp Webhook Invalid Signature', [
                    'channel_id' => $channelId,
                    'ip' => $request->ip(),
                ]);

                return response('Invalid signature', 403);
            }
        }

        // Acknowledge immediately; heavy processing happens on the queue
        // (runs inline during tests because QUEUE_CONNECTION=sync there).
        ProcessWhatsAppWebhook::dispatch($channel->id, $request->all());

        return response('OK', 200);
    }
}
