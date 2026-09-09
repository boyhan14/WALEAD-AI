<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pending_actions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained()->cascadeOnDelete();
            $table->string('agent_id')->nullable(); // AI agent identifier
            $table->string('action_type'); // SEND_MESSAGE, SCHEDULE_FOLLOWUP, MODIFY_TAGS, ISSUE_DISCOUNT, etc.
            $table->json('payload');
            $table->string('risk_level')->default('LOW'); // LOW, MEDIUM, HIGH
            $table->text('reason')->nullable();
            $table->string('status')->default('PENDING'); // PENDING, APPROVED, REJECTED, EXPIRED
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->timestamps();

            $table->index(['workspace_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pending_actions');
    }
};
