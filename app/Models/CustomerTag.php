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
