<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'board_item_id',
        'title',
        'completed',
    ];

    /**
     * Get the board item that owns the task.
     */
    public function boardItem()
    {
        return $this->belongsTo(BoardItems::class , "board_item_id");
    }
}
