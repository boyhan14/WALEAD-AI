<?php

namespace App\Models;

use App\Models\Traits\BelongsToWorkspace;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['workspace_id', 'conversation_id', 'sender_user_id', 'sender_customer_id', 'message_type', 'content', 'direction', 'provider_message_id', 'provider_status', 'metadata', 'is_ai_generated', 'sent_at', 'delivered_at', 'read_at', 'failed_at', 'error_code', 'error_message'])]
class Message extends Model
{
    use BelongsToWorkspace, HasFactory;

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
            'is_ai_generated' => 'boolean',
            'sent_at' => 'datetime',
            'delivered_at' => 'datetime',
            'read_at' => 'datetime',
            'failed_at' => 'datetime',
        ];
    }

    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    public function senderUser()
    {
        return $this->belongsTo(User::class, 'sender_user_id');
    }

    public function senderCustomer()
    {
        return $this->belongsTo(Customer::class, 'sender_customer_id');
    }

    public function attachments()
    {
        return $this->hasMany(MessageAttachment::class);
    }
}
