<?php

namespace App\Http\Controllers;

use App\Models\Channel;
use App\Services\WhatsApp\WhatsAppProviderInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WhatsAppSettingsController extends Controller
{
    public function index(Request $request)
    {
        $workspaceId = $request->user()->current_workspace_id;
        $channel = Channel::where('workspace_id', $workspaceId)->where('type', 'WHATSAPP')->first();

        // Avoid exposing actual tokens to frontend
        $safeConfig = null;
        if ($channel) {
            $safeConfig = [
                'id' => $channel->id,
                'name' => $channel->name,
                'status' => $channel->status,
                'provider' => $channel->config['provider'] ?? config('services.whatsapp.provider'),
                'phone_number_id' => $channel->credentials['phone_number_id'] ?? null,
                'has_access_token' => ! empty($channel->credentials['access_token']),
                'has_app_secret' => ! empty($channel->credentials['app_secret']),
                'webhook_url' => url('/api/webhooks/whatsapp/'.$channel->id),
            ];
        }

        return Inertia::render('Settings/WhatsApp', [
            'channel' => $safeConfig,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'provider' => 'required|in:meta,mock',
            'phone_number_id' => 'required_if:provider,meta',
            'access_token' => 'required_if:provider,meta',
            'app_secret' => 'nullable',
        ]);

        $workspaceId = $request->user()->current_workspace_id;
        $channel = Channel::firstOrNew([
            'workspace_id' => $workspaceId,
            'type' => 'WHATSAPP',
        ]);

        $channel->name = 'WhatsApp Business';
        $channel->status = 'ACTIVE';

        $config = $channel->config ?? [];
        $config['provider'] = $request->provider;
        $channel->config = $config;

        $credentials = $channel->credentials ?? [];
        if ($request->filled('phone_number_id')) {
            $credentials['phone_number_id'] = $request->phone_number_id;
        }
        if ($request->filled('access_token')) {
            $credentials['access_token'] = $request->access_token;
        }
        if ($request->filled('app_secret')) {
            $credentials['app_secret'] = $request->app_secret;
        }

        $channel->credentials = $credentials;
        if ($request->filled('app_secret')) {
            $channel->webhook_secret = $request->app_secret;
        } elseif (! $channel->webhook_secret) {
            $channel->webhook_secret = config('services.whatsapp.verify_token');
        }

        $channel->save();

        return back()->with('status', 'WhatsApp settings saved successfully.');
    }

    public function testConnection(Request $request)
    {
        $workspaceId = $request->user()->current_workspace_id;
        $channel = Channel::where('workspace_id', $workspaceId)->where('type', 'WHATSAPP')->first();

        if (! $channel) {
            return back()->withErrors(['connection' => 'No channel configured.']);
        }

        $whatsapp = app(WhatsAppProviderInterface::class);

        $result = $whatsapp->validateConnection($channel);

        if (! $result['success']) {
            return back()->withErrors(['connection' => $result['error'] ?? 'Connection validation failed.']);
        }

        return back()->with('status', 'WhatsApp connection verified successfully.');
    }
}
