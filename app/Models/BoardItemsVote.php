<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BoardItemsVote extends Model
{
    use HasFactory;

    protected $table = 'board_item_votes'; // Correct table name without the extra 's'

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'board_item_id',
        'user_id',
    ];

    /**
     * Get the item that this vote belongs to.
     */
    public function item()
    {
        return $this->belongsTo(BoardItems::class, 'board_item_id');
    }

    /**
     * Get the user who created this vote.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
