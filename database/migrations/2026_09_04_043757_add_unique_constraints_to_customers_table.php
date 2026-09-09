<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            // Remove regular indexes first if we want to replace them with unique ones
            // Note: In SQLite it might be tricky, but in pgsql it's fine
            $table->dropIndex(['workspace_id', 'phone']);
            $table->dropIndex(['workspace_id', 'email']);

            $table->unique(['workspace_id', 'phone']);
            $table->unique(['workspace_id', 'email']);
        });
    }

    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropUnique(['workspace_id', 'phone']);
            $table->dropUnique(['workspace_id', 'email']);

            $table->index(['workspace_id', 'phone']);
            $table->index(['workspace_id', 'email']);
        });
    }
};
