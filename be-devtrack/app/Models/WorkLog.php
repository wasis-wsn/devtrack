<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkLog extends Model
{
    protected $fillable = [
        'issue_id',
        'user_id',
        'hours',
        'description',
        'logged_at',
    ];

    protected $casts = [
        'logged_at' => 'datetime',
    ];

    // Relationships
    public function issue()
    {
        return $this->belongsTo(Issue::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
