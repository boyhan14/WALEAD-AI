<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained()->cascadeOnDelete();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->foreignId('conversation_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->integer('score')->default(0); // 0-100
            $table->string('temperature')->default('COLD'); // COLD, WARM, HOT, VERY_HOT
            $table->string('intent')->nullable(); // PURCHASE, INQUIRY, COMPLAINT, SUPPORT
            $table->decimal('estimated_value', 15, 2)->default(0);
            $table->string('status')->default('OPEN'); // OPEN, QUALIFIED, CONVERTED, LOST
            $table->text('recommended_action')->nullable();
            $table->timestamp('last_activity_at')->nullable();
            $table->timestamps();

            $table->index(['workspace_id', 'temperature']);
            $table->index(['workspace_id', 'score']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
