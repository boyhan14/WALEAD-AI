<?php

namespace App\Http\Controllers;

use App\Models\Channel;
use App\Services\WhatsApp\WhatsAppWebhookProcessor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SimulatorController extends Controller
{
    public function index()
    {
        return Inertia::render('Simulator/Index');
    }

    public function simulate(Request $request, WhatsAppWebhookProcessor $processor)
    {
        $request->validate([
            'phone' => 'required',
            'name' => 'required',
            'message' => 'required',
        ]);

        $channel = Channel::first();
        if (! $channel) {
            $channel = Channel::create([
                'workspace_id' => $request->user()->current_workspace_id,
                'type' => 'WHATSAPP',
                'name' => 'Demo Channel',
                'status' => 'ACTIVE',
            ]);
        }

        // Build mock Meta webhook payload
        $payload = [
            'entry' => [
                [
                    'changes' => [
                        [
                            'value' => [
                                'contacts' => [['profile' => ['name' => $request->name]]],
                                'messages' => [
                                    [
                                        'from' => $request->phone,
                                        'id' => 'sim_'.uniqid(),
                                        'type' => 'text',
                                        'text' => ['body' => $request->message],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];

        $processor->process($payload, $channel);

        return back()->with('status', 'Simulated message processed successfully!');
    }
}
