<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Customer;
use App\Models\Followup;
use App\Models\Lead;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $workspaceId = $request->user()->current_workspace_id;

        if (! $workspaceId) {
            return Inertia::render('Dashboard', ['stats' => null]);
        }

        $stats = [
            'total_customers' => Customer::where('workspace_id', $workspaceId)->count(),
            'hot_leads' => Lead::where('workspace_id', $workspaceId)->whereIn('temperature', ['HOT', 'VERY_HOT'])->count(),
            'open_conversations' => Conversation::where('workspace_id', $workspaceId)->where('status', 'OPEN')->count(),
            'total_revenue' => Order::where('workspace_id', $workspaceId)->where('status', 'COMPLETED')->sum('total'),
            'pending_followups' => Followup::where('workspace_id', $workspaceId)->where('status', 'PENDING')->count(),
            'recovered_revenue' => Order::where('workspace_id', $workspaceId)->where('status', 'COMPLETED')
                ->whereHas('customer.conversations.messages', function ($q) {
                    $q->where('is_ai_generated', true);
                })->sum('total'),
        ];

        $recentLeads = Lead::where('workspace_id', $workspaceId)
            ->with('customer')
            ->orderByDesc('score')
            ->take(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentLeads' => $recentLeads,
        ]);
    }
}
