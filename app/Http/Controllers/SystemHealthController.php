<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SystemHealthController extends Controller
{
    public function index()
    {
        $checks = [
            'database' => $this->checkDatabase(),
            'cache' => $this->checkCache(),
            'queue' => $this->checkQueue(),
            'whatsapp' => $this->checkWhatsApp(),
        ];

        return Inertia::render('Settings/SystemHealth', [
            'checks' => $checks,
        ]);
    }

    private function checkDatabase(): array
    {
        try {
            DB::connection()->getPdo();

            return ['status' => 'ok', 'message' => 'Connected to '.config('database.default')];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }

    private function checkCache(): array
    {
        try {
            Cache::put('health_check', true, 10);
            $value = Cache::get('health_check');

            return ['status' => $value ? 'ok' : 'error', 'message' => 'Driver: '.config('cache.default')];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }

    private function checkQueue(): array
    {
        $driver = config('queue.default');

        return ['status' => 'ok', 'message' => "Driver: {$driver}"];
    }

    private function checkWhatsApp(): array
    {
        $provider = config('services.whatsapp.provider', 'mock');
        if ($provider === 'mock') {
            return ['status' => 'ok', 'message' => 'Mock provider active (development mode)'];
        }

        $token = config('services.whatsapp.access_token');
        if (! $token) {
            return ['status' => 'warning', 'message' => 'Meta provider configured but no global access token set'];
        }

        return ['status' => 'ok', 'message' => 'Meta provider configured'];
    }
}
