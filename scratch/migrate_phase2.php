<?php

$files = [
    'tags' => 'D:\WALEAD AI\database\migrations\2026_09_04_034927_create_customer_tags_table.php',
    'segments' => 'D:\WALEAD AI\database\migrations\2026_09_04_034928_create_customer_segments_table.php',
    'products' => 'D:\WALEAD AI\database\migrations\2026_09_04_034929_create_products_table.php',
    'variants' => 'D:\WALEAD AI\database\migrations\2026_09_04_034930_create_product_variants_table.php',
    'orders' => 'D:\WALEAD AI\database\migrations\2026_09_04_034931_create_orders_table.php',
    'order_items' => 'D:\WALEAD AI\database\migrations\2026_09_04_034932_create_order_items_table.php',
    'payments' => 'D:\WALEAD AI\database\migrations\2026_09_04_034933_create_payments_table.php',
];

$contents = [
    'tags' => <<<'PHP'
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('customer_tags', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('color')->default('#e2e8f0');
            $table->timestamps();
            $table->unique(['workspace_id', 'name']);
        });
        
        Schema::create('customer_customer_tag', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->foreignId('customer_tag_id')->constrained()->cascadeOnDelete();
            $table->unique(['customer_id', 'customer_tag_id']);
        });
    }
    public function down(): void {
        Schema::dropIfExists('customer_customer_tag');
        Schema::dropIfExists('customer_tags');
    }
};
PHP,

    'segments' => <<<'PHP'
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('customer_segments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->json('rules')->nullable(); // JSON rules for dynamic segmentation
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('customer_segments');
    }
};
PHP,

    'products' => <<<'PHP'
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
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
    public function down(): void {
        Schema::dropIfExists('products');
    }
};
PHP,

    'variants' => <<<'PHP'
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('name'); // e.g. "Size M", "Color Red"
            $table->string('sku')->nullable();
            $table->decimal('price_adjustment', 15, 2)->default(0);
            $table->integer('stock')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }
    public function down(): void {
        Schema::dropIfExists('product_variants');
    }
};
PHP,

    'orders' => <<<'PHP'
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained()->cascadeOnDelete();
            $table->foreignId('customer_id')->nullable()->constrained()->nullOnDelete();
            $table->string('order_number');
            $table->string('status')->default('PENDING'); // PENDING, PAID, SHIPPED, COMPLETED, CANCELLED
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('discount', 15, 2)->default(0);
            $table->decimal('tax', 15, 2)->default(0);
            $table->decimal('shipping_cost', 15, 2)->default(0);
            $table->decimal('total', 15, 2)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->unique(['workspace_id', 'order_number']);
        });
    }
    public function down(): void {
        Schema::dropIfExists('orders');
    }
};
PHP,

    'order_items' => <<<'PHP'
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name'); // snapshot of product name
            $table->decimal('price', 15, 2);
            $table->integer('quantity');
            $table->decimal('total', 15, 2);
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('order_items');
    }
};
PHP,

    'payments' => <<<'PHP'
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained()->cascadeOnDelete();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->decimal('amount', 15, 2);
            $table->string('method')->nullable(); // BANK_TRANSFER, CASH, WALLET
            $table->string('status')->default('COMPLETED'); // PENDING, COMPLETED, FAILED, REFUNDED
            $table->string('reference')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('payments');
    }
};
PHP,
];

foreach ($files as $key => $path) {
    file_put_contents($path, $contents[$key]);
    echo "Updated $path\n";
}
