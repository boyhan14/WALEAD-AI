<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('sku')->nullable();
            $table->text('description')->nullable();
            $table->decimal('price', 15, 2);
            $table->decimal('cost', 15, 2)->nullable();
            $table->integer('stock')->default(0);
            $table->string('category')->nullable();
            $table->json('images')->nullable();
            $table->string('status')->default('ACTIVE'); // ACTIVE, DRAFT, ARCHIVED
            $table->timestamps();
            $table->softDeletes();

            $table->index(['workspace_id', 'sku']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
