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
    use BelongsToWorkspace, HasFactory, SoftDeletes;

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
