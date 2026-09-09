<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['lead_id', 'type', 'score_delta', 'metadata'])]
class LeadEvent extends Model
{
    protected function casts(): array
    {
        return [
            'metadata' => 'array',
        ];
    }

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }
}
