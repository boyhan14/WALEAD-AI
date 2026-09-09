<?php

namespace App\Console\Commands;

use App\Services\FollowUpService;
use Illuminate\Console\Command;

class ProcessFollowUps extends Command
{
    protected $signature = 'walead:process-followups';

    protected $description = 'Scan for abandoned conversations and process pending followups';

    public function handle(FollowUpService $service)
    {
        $this->info('Scanning for abandoned conversations...');
        $service->scanForAbandonedConversations();
        $this->info('Done.');
    }
}
