<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained()->cascadeOnDelete();
            $table->foreignId('sender_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('sender_customer_id')->nullable()->constrained('customers')->nullOnDelete();
            $table->string('type')->default('TEXT'); // TEXT, IMAGE, FILE, AUDIO, VIDEO, SYSTEM
            $table->text('body')->nullable();
            $table->string('direction'); // INBOUND, OUTBOUND
            $table->string('external_id')->nullable();
            $table->string('status')->default('SENT'); // SENT, DELIVERED, READ, FAILED
            $table->json('metadata')->nullable();
            $table->boolean('is_ai_generated')->default(false);
            $table->timestamps();

            $table->index(['conversation_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
