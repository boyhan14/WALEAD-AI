<?php

namespace Tests\Feature;

use App\Models\Channel;
use App\Models\Conversation;
use App\Models\Customer;
use App\Models\Message;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WhatsAppWebhookTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private Workspace $workspace;

    private Channel $channel;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->workspace = Workspace::create(['name' => 'Test Workspace']);
        $this->user->workspaces()->attach($this->workspace->id, ['role' => 'OWNER']);
        $this->user->update(['current_workspace_id' => $this->workspace->id]);

        $this->channel = Channel::create([
            'workspace_id' => $this->workspace->id,
            'type' => 'WHATSAPP',
            'name' => 'Test WhatsApp',
            'status' => 'ACTIVE',
            'webhook_secret' => 'test_verify_token',
        ]);
    }

    public function test_webhook_verification_success(): void
    {
        $response = $this->get('/api/webhooks/whatsapp/'.$this->channel->id.'?'.http_build_query([
            'hub_mode' => 'subscribe',
            'hub_verify_token' => 'test_verify_token',
            'hub_challenge' => 'challenge_abc123',
        ]));

        $response->assertStatus(200);
        $response->assertSee('challenge_abc123');
    }

    public function test_webhook_verification_failure_wrong_token(): void
    {
        $response = $this->get('/api/webhooks/whatsapp/'.$this->channel->id.'?'.http_build_query([
            'hub_mode' => 'subscribe',
            'hub_verify_token' => 'wrong_token',
            'hub_challenge' => 'challenge_abc123',
        ]));

        $response->assertStatus(403);
    }

    public function test_webhook_verification_failure_wrong_mode(): void
    {
        $response = $this->get('/api/webhooks/whatsapp/'.$this->channel->id.'?'.http_build_query([
            'hub_mode' => 'unsubscribe',
            'hub_verify_token' => 'test_verify_token',
            'hub_challenge' => 'challenge_abc123',
        ]));

        $response->assertStatus(403);
    }

    public function test_webhook_unknown_channel_returns_404(): void
    {
        $response = $this->get('/api/webhooks/whatsapp/99999?'.http_build_query([
            'hub_mode' => 'subscribe',
            'hub_verify_token' => 'test_verify_token',
            'hub_challenge' => 'challenge_abc123',
        ]));

        $response->assertStatus(404);
    }

    public function test_webhook_post_text_message_creates_records(): void
    {
        $payload = $this->buildPayload([
            'from' => '628123456789',
            'id' => 'wamid_text_001',
            'type' => 'text',
            'text' => ['body' => 'Halo, saya mau pesan'],
        ]);

        $response = $this->postJson('/api/webhooks/whatsapp/'.$this->channel->id, $payload);
        $response->assertStatus(200);

        $this->assertDatabaseHas('customers', [
            'workspace_id' => $this->workspace->id,
            'phone' => '628123456789',
        ]);

        $this->assertDatabaseHas('messages', [
            'provider_message_id' => 'wamid_text_001',
            'message_type' => 'TEXT',
            'direction' => 'INBOUND',
        ]);
    }

    public function test_webhook_message_without_provider_id_is_ignored(): void
    {
        $payload = $this->buildPayload([
            'from' => '628123456789',
            'type' => 'text',
            'text' => ['body' => 'Message without an id'],
        ]);

        $this->postJson('/api/webhooks/whatsapp/'.$this->channel->id, $payload)
            ->assertOk();

        $this->assertDatabaseCount('messages', 0);
    }

    public function test_webhook_post_image_message(): void
    {
        $payload = $this->buildPayload([
            'from' => '628123456789',
            'id' => 'wamid_img_001',
            'type' => 'image',
            'image' => [
                'id' => 'media_123',
                'mime_type' => 'image/jpeg',
                'caption' => 'Foto produk',
            ],
        ]);

        $response = $this->postJson('/api/webhooks/whatsapp/'.$this->channel->id, $payload);
        $response->assertStatus(200);

        $this->assertDatabaseHas('messages', [
            'provider_message_id' => 'wamid_img_001',
            'message_type' => 'IMAGE',
            'content' => 'Foto produk',
        ]);
    }

    public function test_webhook_duplicate_message_is_idempotent(): void
    {
        $payload = $this->buildPayload([
            'from' => '628123456789',
            'id' => 'wamid_dup_001',
            'type' => 'text',
            'text' => ['body' => 'Pesan pertama'],
        ]);

        // Send twice
        $this->postJson('/api/webhooks/whatsapp/'.$this->channel->id, $payload);
        $this->postJson('/api/webhooks/whatsapp/'.$this->channel->id, $payload);

        // Should only have one INBOUND message (AI reply may create outbound)
        $inboundCount = Message::where('provider_message_id', 'wamid_dup_001')->count();
        $this->assertEquals(1, $inboundCount);
    }

    public function test_webhook_status_delivered_updates_message(): void
    {
        // Create proper foreign keys first
        $customer = Customer::create([
            'workspace_id' => $this->workspace->id,
            'name' => 'Status Test',
            'phone' => '628111111111',
        ]);

        $conversation = Conversation::create([
            'workspace_id' => $this->workspace->id,
            'channel_id' => $this->channel->id,
            'customer_id' => $customer->id,
            'status' => 'OPEN',
        ]);

        Message::create([
            'workspace_id' => $this->workspace->id,
            'conversation_id' => $conversation->id,
            'message_type' => 'TEXT',
            'content' => 'Outbound test',
            'direction' => 'OUTBOUND',
            'provider_message_id' => 'wamid_status_001',
            'provider_status' => 'SENT',
        ]);

        $payload = [
            'entry' => [[
                'changes' => [[
                    'value' => [
                        'statuses' => [[
                            'id' => 'wamid_status_001',
                            'status' => 'delivered',
                            'timestamp' => (string) time(),
                        ]],
                    ],
                ]],
            ]],
        ];

        $response = $this->postJson('/api/webhooks/whatsapp/'.$this->channel->id, $payload);
        $response->assertStatus(200);

        $this->assertDatabaseHas('messages', [
            'provider_message_id' => 'wamid_status_001',
            'provider_status' => 'DELIVERED',
        ]);
    }

    public function test_webhook_status_does_not_regress(): void
    {
        $customer = Customer::create([
            'workspace_id' => $this->workspace->id,
            'name' => 'Regress Test',
            'phone' => '628222222222',
        ]);

        $conversation = Conversation::create([
            'workspace_id' => $this->workspace->id,
            'channel_id' => $this->channel->id,
            'customer_id' => $customer->id,
            'status' => 'OPEN',
        ]);

        Message::create([
            'workspace_id' => $this->workspace->id,
            'conversation_id' => $conversation->id,
            'message_type' => 'TEXT',
            'content' => 'Already read',
            'direction' => 'OUTBOUND',
            'provider_message_id' => 'wamid_regress_001',
            'provider_status' => 'READ',
        ]);

        $payload = [
            'entry' => [[
                'changes' => [[
                    'value' => [
                        'statuses' => [[
                            'id' => 'wamid_regress_001',
                            'status' => 'sent',
                            'timestamp' => (string) time(),
                        ]],
                    ],
                ]],
            ]],
        ];

        $this->postJson('/api/webhooks/whatsapp/'.$this->channel->id, $payload);

        // Should still be READ, not regressed to SENT
        $this->assertDatabaseHas('messages', [
            'provider_message_id' => 'wamid_regress_001',
            'provider_status' => 'READ',
        ]);
    }

    public function test_webhook_status_failed_updates_error(): void
    {
        $customer = Customer::create([
            'workspace_id' => $this->workspace->id,
            'name' => 'Fail Test',
            'phone' => '628333333333',
        ]);

        $conversation = Conversation::create([
            'workspace_id' => $this->workspace->id,
            'channel_id' => $this->channel->id,
            'customer_id' => $customer->id,
            'status' => 'OPEN',
        ]);

        Message::create([
            'workspace_id' => $this->workspace->id,
            'conversation_id' => $conversation->id,
            'message_type' => 'TEXT',
            'content' => 'Will fail',
            'direction' => 'OUTBOUND',
            'provider_message_id' => 'wamid_fail_001',
            'provider_status' => 'SENT',
        ]);

        $payload = [
            'entry' => [[
                'changes' => [[
                    'value' => [
                        'statuses' => [[
                            'id' => 'wamid_fail_001',
                            'status' => 'failed',
                            'timestamp' => (string) time(),
                            'errors' => [[
                                'code' => 131047,
                                'title' => 'Re-engagement message',
                            ]],
                        ]],
                    ],
                ]],
            ]],
        ];

        $this->postJson('/api/webhooks/whatsapp/'.$this->channel->id, $payload);

        $msg = Message::where('provider_message_id', 'wamid_fail_001')->first();
        $this->assertEquals('FAILED', $msg->provider_status);
        $this->assertNotNull($msg->failed_at);
    }

    public function test_tenant_isolation_webhook_cannot_cross_workspaces(): void
    {
        $otherWorkspace = Workspace::create(['name' => 'Other Tenant']);
        $otherChannel = Channel::create([
            'workspace_id' => $otherWorkspace->id,
            'type' => 'WHATSAPP',
            'name' => 'Other Channel',
            'status' => 'ACTIVE',
        ]);

        // POST directly to the other channel's webhook endpoint
        $payload = [
            'entry' => [[
                'changes' => [[
                    'value' => [
                        'contacts' => [['profile' => ['name' => 'Cross Tenant User']]],
                        'messages' => [[
                            'from' => '628999999999',
                            'id' => 'wamid_tenant_001',
                            'type' => 'text',
                            'text' => ['body' => 'Cross-tenant test'],
                        ]],
                    ],
                ]],
            ]],
        ];

        $this->postJson('/api/webhooks/whatsapp/'.$otherChannel->id, $payload);

        // Customer should be in other workspace, NOT in our test workspace
        $this->assertDatabaseHas('customers', [
            'workspace_id' => $otherWorkspace->id,
            'phone' => '628999999999',
        ]);

        $this->assertDatabaseMissing('customers', [
            'workspace_id' => $this->workspace->id,
            'phone' => '628999999999',
        ]);
    }

    /**
     * Build a standard Meta webhook payload.
     */
    private function buildPayload(array $message, string $contactName = 'Test User'): array
    {
        return [
            'entry' => [[
                'changes' => [[
                    'value' => [
                        'contacts' => [['profile' => ['name' => $contactName]]],
                        'messages' => [$message],
                    ],
                ]],
            ]],
        ];
    }
}
