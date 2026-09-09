<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('channels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained()->cascadeOnDelete();
            $table->string('type'); // WHATSAPP, INSTAGRAM, TELEGRAM, WEBSITE, EMAIL
            $table->string('name');
            $table->json('credentials')->nullable(); // encrypted channel credentials
            $table->json('config')->nullable();
            $table->string('status')->default('ACTIVE'); // ACTIVE, INACTIVE, ERROR
            $table->string('webhook_secret')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('channels');
    }
};
