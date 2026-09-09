<?php

namespace App\Services\WhatsApp;

use App\Jobs\ProcessIncomingWhatsAppMessage;
use App\Models\Channel;
use App\Models\Conversation;
use App\Models\Customer;
use App\Models\Message;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;

class WhatsAppWebhookProcessor
{
    public function process(array $payload, Channel $channel)
    {
        Log::info('Processing WhatsApp Webhook', [
            'channel_id' => $channel->id,
            'entry_count' => count($payload['entry'] ?? []),
        ]);

        $workspaceId = $channel->workspace_id;
        $entries = $payload['entry'] ?? [];

        foreach ($entries as $entry) {
            $changes = $entry['changes'] ?? [];
            foreach ($changes as $change) {
                $value = $change['value'] ?? [];

                // Process Messages
                if (isset($value['messages'])) {
                    foreach ($value['messages'] as $msg) {
                        $this->handleIncomingMessage($workspaceId, $channel, $msg, $value['contacts'][0] ?? null);
                    }
                }

                // Process Statuses
                if (isset($value['statuses'])) {
                    foreach ($value['statuses'] as $status) {
                        $this->handleStatusUpdate($status);
                    }
                }
            }
        }
    }

    private function handleIncomingMessage($workspaceId, $channel, array $msg, ?array $contact)
    {
        $phone = $msg['from'] ?? null;
        $name = $contact['profile']['name'] ?? 'Unknown WhatsApp User';
        $externalId = $msg['id'] ?? null;
        $msgType = $msg['type'] ?? 'text';

        if (! $phone) {
            return;
        }

        // Extract content and metadata based on message type
        $content = null;
        $metadata = [];

        switch ($msgType) {
            case 'text':
                $content = $msg['text']['body'] ?? null;
                break;
            case 'image':
                $content = $msg['image']['caption'] ?? '[Image]';
                $metadata['media_id'] = $msg['image']['id'] ?? null;
                $metadata['mime_type'] = $msg['image']['mime_type'] ?? null;
                break;
            case 'audio':
                $content = '[Audio]';
                $metadata['media_id'] = $msg['audio']['id'] ?? null;
                $metadata['mime_type'] = $msg['audio']['mime_type'] ?? null;
                break;
            case 'video':
                $content = $msg['video']['caption'] ?? '[Video]';
                $metadata['media_id'] = $msg['video']['id'] ?? null;
                $metadata['mime_type'] = $msg['video']['mime_type'] ?? null;
                break;
            case 'document':
                $content = $msg['document']['caption'] ?? $msg['document']['filename'] ?? '[Document]';
                $metadata['media_id'] = $msg['document']['id'] ?? null;
                $metadata['filename'] = $msg['document']['filename'] ?? null;
                $metadata['mime_type'] = $msg['document']['mime_type'] ?? null;
                break;
            case 'location':
                $content = '[Location]';
                $metadata['latitude'] = $msg['location']['latitude'] ?? null;
                $metadata['longitude'] = $msg['location']['longitude'] ?? null;
                $metadata['name'] = $msg['location']['name'] ?? null;
                $metadata['address'] = $msg['location']['address'] ?? null;
                break;
            case 'contacts':
                $content = '[Contact shared]';
                $metadata['contacts'] = $msg['contacts'] ?? [];
                break;
            case 'interactive':
                $content = $msg['interactive']['button_reply']['title']
                    ?? $msg['interactive']['list_reply']['title']
                    ?? '[Interactive reply]';
                $metadata['interactive'] = $msg['interactive'] ?? [];
                break;
            case 'button':
                $content = $msg['button']['text'] ?? '[Button reply]';
                break;
            case 'reaction':
                $content = $msg['reaction']['emoji'] ?? '[Reaction]';
                $metadata['reacted_message_id'] = $msg['reaction']['message_id'] ?? null;
                break;
            default:
                $content = "[Unsupported: {$msgType}]";
                Log::info("Unsupported WhatsApp message type: {$msgType}", ['message_id' => $externalId]);
                break;
        }

        if (! $content || ! $externalId) {
            return;
        }

        // Prevent duplicate processing
        if (Message::where('provider_message_id', $externalId)->exists()) {
            return;
        }

        try {
            $customer = Customer::firstOrCreate(
                ['workspace_id' => $workspaceId, 'phone' => $phone],
                ['name' => $name]
            );

            $conversation = Conversation::firstOrCreate(
                ['workspace_id' => $workspaceId, 'customer_id' => $customer->id, 'status' => 'OPEN'],
                ['channel_id' => $channel->id, 'last_message_at' => now()]
            );

            Message::create([
                'workspace_id' => $workspaceId,
                'conversation_id' => $conversation->id,
                'sender_customer_id' => $customer->id,
                'message_type' => strtoupper($msgType),
                'content' => $content,
                'direction' => 'INBOUND',
                'provider_message_id' => $externalId,
                'metadata' => ! empty($metadata) ? $metadata : null,
            ]);

            $conversation->update(['last_message_at' => now()]);

            // Only dispatch AI processing for text messages
            if ($msgType === 'text') {
                ProcessIncomingWhatsAppMessage::dispatch($conversation->id, $content);
            }
        } catch (QueryException $e) {
            // Check if it's a unique constraint violation (code 23505 in pgsql)
            if ($e->getCode() === '23505') {
                Log::warning('Duplicate message or customer creation blocked by unique constraint in webhook.', ['external_id' => $externalId]);

                return;
            }
            throw $e;
        }
    }

    private function handleStatusUpdate(array $status)
    {
        $externalId = $status['id'] ?? null;
        $statusValue = $status['status'] ?? null; // sent, delivered, read, failed

        if (! $externalId || ! $statusValue) {
            return;
        }

        $message = Message::where('provider_message_id', $externalId)->first();
        if (! $message) {
            return;
        }

        // Prevent regression of status (e.g., READ going back to SENT)
        $hierarchy = ['failed' => 0, 'sent' => 1, 'delivered' => 2, 'read' => 3];
        $currentValue = $hierarchy[strtolower($message->provider_status ?? '')] ?? -1;
        $newValue = $hierarchy[strtolower($statusValue)] ?? -1;

        if ($newValue < $currentValue && strtolower($statusValue) !== 'failed') {
            return;
        }

        $updateData = ['provider_status' => strtoupper($statusValue)];

        $timestamp = isset($status['timestamp']) ? Carbon::createFromTimestamp($status['timestamp']) : now();

        switch (strtolower($statusValue)) {
            case 'sent':
                $updateData['sent_at'] = $timestamp;
                break;
            case 'delivered':
                $updateData['delivered_at'] = $timestamp;
                break;
            case 'read':
                $updateData['read_at'] = $timestamp;
                break;
            case 'failed':
                $updateData['failed_at'] = $timestamp;
                $updateData['error_code'] = $status['errors'][0]['code'] ?? null;
                $updateData['error_message'] = $status['errors'][0]['title'] ?? $status['errors'][0]['message'] ?? null;
                break;
        }

        $message->update($updateData);
    }
}
