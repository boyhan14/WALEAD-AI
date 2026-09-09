<?php

namespace App\Models;

use App\Models\Traits\BelongsToWorkspace;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['workspace_id', 'customer_id', 'conversation_id', 'product_id', 'score', 'temperature', 'intent', 'estimated_value', 'status', 'recommended_action', 'last_activity_at'])]
class Lead extends Model
{
    use BelongsToWorkspace, HasFactory;

    protected function casts(): array
    {
        return [
            'last_activity_at' => 'datetime',
            'estimated_value' => 'decimal:2',
        ];
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function scores()
    {
        return $this->hasMany(LeadScore::class);
    }

    public function events()
    {
        return $this->hasMany(LeadEvent::class);
    }
}
