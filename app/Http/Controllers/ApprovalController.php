<?php

namespace App\Http\Controllers;

use App\Models\PendingAction;
use App\Services\ActionExecutionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ApprovalController extends Controller
{
    public function index()
    {
        $actions = PendingAction::where('status', 'PENDING')->latest()->paginate(20);

        return Inertia::render('Approvals/Index', ['actions' => $actions]);
    }

    public function update(Request $request, PendingAction $approval)
    {
        abort_unless($approval->workspace_id === $request->user()->current_workspace_id, 404);

        $request->validate(['status' => 'required|in:APPROVED,REJECTED']);

        $approval = DB::transaction(function () use ($approval, $request): PendingAction {
            $lockedApproval = PendingAction::query()
                ->whereKey($approval->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($lockedApproval->status !== 'PENDING') {
                abort(400, 'This action has already been processed.');
            }

            $lockedApproval->update([
                'status' => $request->status,
                'approved_by' => $request->user()->id,
                'approved_at' => $request->status === 'APPROVED' ? now() : null,
                'rejected_at' => $request->status === 'REJECTED' ? now() : null,
            ]);

            return $lockedApproval;
        });

        if ($request->status === 'APPROVED') {
            app(ActionExecutionService::class)->execute($approval);
        }

        return back()->with('status', 'Action '.strtolower($request->status));
    }
}
