<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Board extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
        'status',
        'type_id',
        'creator_id',
        'team_id',
        'is_private',
        'settings',
        'template_id',
    ];

     /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'settings' => 'array',
        'is_private' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Generate slug from name when creating a new board
        static::creating(function ($board) {
            if (empty($board->slug)) {
                $board->slug = Str::slug($board->name);
            }
        });
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }

    /**
     * Get the board type that this board belongs to.
     */
    public function type(): BelongsTo
    {
        return $this->belongsTo(BoardType::class);
    }

    /**
     * Get the creator of this board.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    /**
     * Get the team this board belongs to.
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * Get the items on this board.
     */
    public function items(): HasMany
    {
        return $this->hasMany(BoardItems::class);
    }

    /**
     * Get the members of this board.
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'board_members')
                    ->withPivot('role')
                    ->withTimestamps();
    }
}
