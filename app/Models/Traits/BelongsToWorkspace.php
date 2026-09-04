<?php

namespace App\Models\Traits;

use App\Models\Scopes\WorkspaceScope;
use App\Models\Workspace;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[ScopedBy([WorkspaceScope::class])]
trait BelongsToWorkspace
{
    /**
     * Get the workspace that owns the model.
     */
    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    /**
     * Boot the BelongsToWorkspace trait for a model.
     */
    protected static function bootBelongsToWorkspace(): void
    {
        static::creating(function ($model) {
            if (auth()->check() && ! $model->workspace_id) {
                $model->workspace_id = auth()->user()->current_workspace_id;
            }
        });
    }
}
