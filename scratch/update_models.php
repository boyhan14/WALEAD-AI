<?php

$models = [
    'Customer' => <<<'PHP'
<?php
namespace App\Models;

use App\Models\Traits\BelongsToWorkspace;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['workspace_id', 'name', 'phone', 'email', 'notes', 'lifetime_value'])]
class Customer extends Model
{
    use HasFactory, SoftDeletes, BelongsToWorkspace;

    public function tags()
    {
        return $this->belongsToMany(CustomerTag::class, 'customer_customer_tag');
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
PHP,

    'CustomerTag' => <<<'PHP'
<?php
namespace App\Models;

use App\Models\Traits\BelongsToWorkspace;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['workspace_id', 'name', 'color'])]
class CustomerTag extends Model
{
    use BelongsToWorkspace;

    public function customers()
    {
        return $this->belongsToMany(Customer::class, 'customer_customer_tag');
    }
}
PHP,

    'CustomerSegment' => <<<'PHP'
<?php
namespace App\Models;

use App\Models\Traits\BelongsToWorkspace;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['workspace_id', 'name', 'description', 'rules'])]
class CustomerSegment extends Model
{
    use BelongsToWorkspace;

    protected function casts(): array
    {
        return [
            'rules' => 'array',
        ];
    }
}
PHP,

    'Product' => <<<'PHP'
<?php
namespace App\Models;

use App\Models\Traits\BelongsToWorkspace;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['workspace_id', 'name', 'sku', 'description', 'price', 'cost', 'stock', 'category', 'images', 'status'])]
class Product extends Model
{
    use HasFactory, SoftDeletes, BelongsToWorkspace;

    protected function casts(): array
    {
        return [
            'images' => 'array',
            'price' => 'decimal:2',
            'cost' => 'decimal:2',
        ];
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }
}
PHP,

    'ProductVariant' => <<<'PHP'
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['product_id', 'name', 'sku', 'price_adjustment', 'stock'])]
class ProductVariant extends Model
{
    use HasFactory, SoftDeletes;

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
PHP,

    'Order' => <<<'PHP'
<?php
namespace App\Models;

use App\Models\Traits\BelongsToWorkspace;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['workspace_id', 'customer_id', 'order_number', 'status', 'subtotal', 'discount', 'tax', 'shipping_cost', 'total', 'notes'])]
class Order extends Model
{
    use HasFactory, SoftDeletes, BelongsToWorkspace;

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
PHP,

    'OrderItem' => <<<'PHP'
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['order_id', 'product_id', 'product_variant_id', 'name', 'price', 'quantity', 'total'])]
class OrderItem extends Model
{
    use HasFactory;

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }
}
PHP,

    'Payment' => <<<'PHP'
<?php
namespace App\Models;

use App\Models\Traits\BelongsToWorkspace;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['workspace_id', 'order_id', 'amount', 'method', 'status', 'reference', 'paid_at'])]
class Payment extends Model
{
    use HasFactory, BelongsToWorkspace;

    protected function casts(): array
    {
        return [
            'paid_at' => 'datetime',
        ];
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
PHP,
];

foreach ($models as $name => $content) {
    file_put_contents("D:\WALEAD AI\app\Models\\$name.php", $content);
    echo "Updated $name\n";
}
