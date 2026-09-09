<?php

namespace Tests\Feature;

use App\Models\Channel;
use App\Models\Customer;
use App\Models\PendingAction;
use App\Models\User;
use App\Models\Workspace;
use App\Services\WhatsApp\WhatsAppWebhookProcessor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WaleadE2ETest extends TestCase
{
    use RefreshDatabase;

    public function test_workspace_isolation_and_multi_tenancy()
    {
        $userA = User::factory()->create();
        $workspaceA = Workspace::create(['name' => 'Toko A']);
        $userA->workspaces()->attach($workspaceA->id, ['role' => 'OWNER']);
        $userA->update(['current_workspace_id' => $workspaceA->id]);

        $userB = User::factory()->create();
        $workspaceB = Workspace::create(['name' => 'Toko B']);
        $userB->workspaces()->attach($workspaceB->id, ['role' => 'OWNER']);
        $userB->update(['current_workspace_id' => $workspaceB->id]);

        // Create customer in Workspace A
        $customerA = Customer::create([
            'workspace_id' => $workspaceA->id,
            'name' => 'Customer A',
            'phone' => '62811111111',
            'lifetime_value' => 50000,
        ]);

        // Authenticated as User B, querying customers should NOT return customer A
        $this->actingAs($userB);
        $this->assertDatabaseHas('customers', ['id' => $customerA->id, 'workspace_id' => $workspaceA->id]);

        $response = $this->get(route('customers.index'));
        $response->assertStatus(200);
        $response->assertDontSee('Customer A');
    }

    public function test_whatsapp_webhook_creates_customer_conversation_and_triggers_ai()
    {
        $user = User::factory()->create();
        $workspace = Workspace::create(['name' => 'Toko Sepatu']);
        $user->workspaces()->attach($workspace->id, ['role' => 'OWNER']);
        $user->update(['current_workspace_id' => $workspace->id]);

        $channel = Channel::create([
            'workspace_id' => $workspace->id,
            'type' => 'WHATSAPP',
            'name' => 'WhatsApp Store',
            'status' => 'ACTIVE',
        ]);

        $processor = app(WhatsAppWebhookProcessor::class);

        $payload = [
            'entry' => [
                [
                    'changes' => [
                        [
                            'value' => [
                                'contacts' => [['profile' => ['name' => 'Budi Sepatu']]],
                                'messages' => [
                                    [
                                        'from' => '6281299998888',
                                        'id' => 'wamid_test_123',
                                        'type' => 'text',
                                        'text' => ['body' => 'Halo kak, sepatu Nike hitam ukuran 42 berapa harganya?'],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];

        $processor->process($payload, $channel);

        // Verify customer created
        $this->assertDatabaseHas('customers', [
            'workspace_id' => $workspace->id,
            'phone' => '6281299998888',
            'name' => 'Budi Sepatu',
        ]);

        // Verify conversation created
        $this->assertDatabaseHas('conversations', [
            'workspace_id' => $workspace->id,
            'channel_id' => $channel->id,
            'status' => 'OPEN',
        ]);

        // Verify lead created with price_inquiry intent
        $this->assertDatabaseHas('leads', [
            'workspace_id' => $workspace->id,
            'temperature' => 'COLD', // initial score from delta
        ]);
    }

    public function test_customer_simulator_endpoint()
    {
        $user = User::factory()->create();
        $workspace = Workspace::create(['name' => 'Toko Demo']);
        $user->workspaces()->attach($workspace->id, ['role' => 'OWNER']);
        $user->update(['current_workspace_id' => $workspace->id]);

        $this->actingAs($user);

        $response = $this->post(route('simulator.simulate'), [
            'phone' => '6281233334444',
            'name' => 'Rina Toko',
            'message' => 'Saya mau beli dan checkout sekarang kak',
        ]);

        $response->assertSessionHas('status');

        $this->assertDatabaseHas('customers', [
            'workspace_id' => $workspace->id,
            'phone' => '6281233334444',
            'name' => 'Rina Toko',
        ]);

        // Checkout intent has medium/high risk, so pending action should be created
        $this->assertDatabaseHas('pending_actions', [
            'workspace_id' => $workspace->id,
            'status' => 'PENDING',
        ]);
    }

    public function test_human_in_the_loop_approval_execution()
    {
        $user = User::factory()->create();
        $workspace = Workspace::create(['name' => 'Toko Approval']);
        $user->workspaces()->attach($workspace->id, ['role' => 'OWNER']);
        $user->update(['current_workspace_id' => $workspace->id]);

        $action = PendingAction::create([
            'workspace_id' => $workspace->id,
            'agent_id' => 'ai_sales_agent',
            'action_type' => 'send_message',
            'payload' => [
                'conversation_id' => 1,
                'message' => 'Tawaran diskon 10% untuk kakak!',
            ],
            'risk_level' => 'HIGH',
            'reason' => 'Permintaan diskon khusus',
            'status' => 'PENDING',
        ]);

        $this->actingAs($user);

        $response = $this->post(route('approvals.update', $action), [
            'status' => 'APPROVED',
        ]);

        $response->assertSessionHas('status', 'Action approved');

        $this->assertDatabaseHas('pending_actions', [
            'id' => $action->id,
            'status' => 'APPROVED',
            'approved_by' => $user->id,
        ]);
    }
}
