<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['message_id', 'type', 'file_path', 'file_name', 'mime_type', 'file_size'])]
class MessageAttachment extends Model
{
    public function message()
    {
        return $this->belongsTo(Message::class);
    }
}
