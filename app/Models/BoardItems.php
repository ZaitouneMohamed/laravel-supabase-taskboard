<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class BoardItems extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "board_items";

    protected $fillable = [
        'board_id',
        'creator_id',
        'title',
        'content',
        'position',
        'votes',
        'status',
        'meta_data',
        "Priority"
    ];

    protected $casts = [
        'meta_data' => 'array',
    ];

    /**
     * The board this item belongs to.
     */
    public function board()
    {
        return $this->belongsTo(Board::class);
    }

    /**
     * The user who created the board item.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    /**
     * Get the votes for this item.
     */
    public function votes()
    {
        return $this->hasMany(BoardItemsVote::class, 'board_item_id');
    }

     /**
     * Get all comments associated with this board item.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function comments(): HasMany
    {
        return $this->hasMany(BoardComment::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class , 'board_item_id')->latest();
    }

    /**
     * Check if the item is voted by the given user.
     *
     * @param  \App\Models\User  $user
     * @return bool
     */
    public function isVotedBy(User $user)
    {
        if (!$user) {
            return false;
        }

        return $this->votes()->where('user_id', $user->id)->exists();
    }
}
