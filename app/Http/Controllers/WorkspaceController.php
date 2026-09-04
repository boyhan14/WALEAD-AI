<?php

namespace App\Http\Controllers;

use App\Models\Workspace;
use Illuminate\Http\Request;
use Illuminate\Http\Request;

class WorkspaceController extends Controller
{
    /**
     * Switch the user's current workspace.
     */
    public function switch(Request $request, Workspace $workspace)
    {
        $user = $request->user();

        // Ensure the user belongs to the requested workspace
        if (! $user->workspaces()->where('workspace_id', $workspace->id)->exists()) {
            abort(403, 'You do not have access to this workspace.');
        }

        $user->update([
            'current_workspace_id' => $workspace->id,
        ]);

        return back()->with('status', 'Workspace switched successfully.');
    }
}
