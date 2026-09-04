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
    use BelongsToWorkspace, HasFactory, SoftDeletes;

    public function tags()
    {
        return $this->belongsToMany(CustomerTag::class, 'customer_customer_tag');
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
