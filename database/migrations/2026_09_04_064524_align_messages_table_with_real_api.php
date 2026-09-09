<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->renameColumn('external_id', 'provider_message_id');
            $table->renameColumn('status', 'provider_status');
            $table->renameColumn('type', 'message_type');
            $table->renameColumn('body', 'content');

            $table->timestamp('sent_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamp('failed_at')->nullable();

            $table->string('error_code')->nullable();
            $table->text('error_message')->nullable();

            // Add indexes requested
            // Note: workspace_id is not in messages table, it's on conversation. So we can't index it directly here easily without adding the column.
            // Let's add workspace_id to messages for easier querying as requested.
            $table->foreignId('workspace_id')->nullable()->constrained()->cascadeOnDelete();

            $table->index(['workspace_id']);
            // $table->index(['provider_message_id']); // It's already unique from previous migration, so indexed
            // $table->index(['conversation_id']); // Already indexed in create migration
            // $table->index(['created_at']); // Already indexed
            $table->index(['sender_customer_id']); // This is customer_id equivalent for messages
        });
    }

    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropForeign(['workspace_id']);
            $table->dropColumn(['workspace_id', 'sent_at', 'delivered_at', 'read_at', 'failed_at', 'error_code', 'error_message']);

            $table->renameColumn('provider_message_id', 'external_id');
            $table->renameColumn('provider_status', 'status');
            $table->renameColumn('message_type', 'type');
            $table->renameColumn('content', 'body');
        });
    }
};
