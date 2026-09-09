<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['lead_id', 'score', 'reason', 'factors'])]
class LeadScore extends Model
{
    protected function casts(): array
    {
        return [
            'factors' => 'array',
        ];
    }

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }
}
