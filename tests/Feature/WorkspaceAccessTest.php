<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Workspace;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WorkspaceAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_without_workspace_is_denied_workspace_routes(): void
    {
        $this->actingAs(User::factory()->create());

        $this->get(route('customers.index'))
            ->assertForbidden();
    }

    public function test_stale_workspace_selection_is_repaired_from_membership(): void
    {
        $staleWorkspace = Workspace::create(['name' => 'Stale Workspace']);
        $user = User::factory()->create(['current_workspace_id' => $staleWorkspace->id]);
        $workspace = Workspace::create(['name' => 'Recovery Workspace']);
        $user->workspaces()->attach($workspace->id, ['role' => 'OWNER']);

        $this->actingAs($user);

        $this->get(route('customers.index'))
            ->assertOk();

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'current_workspace_id' => $workspace->id,
        ]);
    }
}
