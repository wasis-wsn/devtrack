<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Issue extends Model
{
    protected $fillable = [
        'title',
        'description',
        'project_id',
        'assigned_to',
        'type',
        'status',
        'priority',
    ];

    // Relationships
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function workLogs()
    {
        return $this->hasMany(WorkLog::class);
    }

    // Helper methods
    public function getTotalWorkingHours()
    {
        return $this->workLogs()->sum('hours');
    }
}
