<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Services\WhatsApp\WhatsAppProviderInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class InboxController extends Controller
{
    public function index(Request $request)
    {
        $conversations = Conversation::with(['customer', 'latestMessage'])->latest('last_message_at')->paginate(20);

        return Inertia::render('Inbox/Index', ['conversations' => $conversations]);
    }

    public function show(Request $request, Conversation $conversation)
    {
        abort_unless($conversation->workspace_id === $request->user()->current_workspace_id, 404);

        $conversation->load('customer');
        $messages = $conversation->messages()->oldest()->get();

        return Inertia::render('Inbox/Show', ['conversation' => $conversation, 'messages' => $messages]);
    }

    public function storeMessage(Request $request, Conversation $conversation)
    {
        abort_unless($conversation->workspace_id === $request->user()->current_workspace_id, 404);

        $request->validate(['body' => 'required|string']);

        $whatsapp = app(WhatsAppProviderInterface::class);
        $result = $whatsapp->sendMessage($conversation->channel, $conversation->customer->phone, $request->body);

        if (! $result['success']) {
            Log::error('Failed to send WhatsApp message via provider from Inbox: '.($result['error'] ?? 'Unknown error'));
        }

        $conversation->messages()->create([
            'workspace_id' => $conversation->workspace_id,
            'sender_user_id' => $request->user()->id,
            'message_type' => 'TEXT',
            'content' => $request->body,
            'direction' => 'OUTBOUND',
            'provider_message_id' => $result['message_id'] ?? null,
            'provider_status' => $result['success'] ? 'SENT' : 'FAILED',
            'metadata' => isset($result['error']) ? ['error' => $result['error']] : null,
        ]);
        $conversation->update(['last_message_at' => now()]);

        return back();
    }
}
