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
