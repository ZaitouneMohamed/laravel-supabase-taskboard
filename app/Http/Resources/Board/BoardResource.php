<?php

namespace App\Http\Resources\Board;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class BoardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
         // Load necessary relationships if they haven't been loaded already
         if (!$this->relationLoaded('creator')) {
            $this->load([
                'creator',
                'type',
                'team',
                'members',
                'items' => function($query) {
                    $query->latest()->take(10);
                }
            ]);
        }

        $filteredMembers = $this->members->filter(function ($member) {
            return $member->id !== $this->creator_id;
        })->values();
        // Check user permissions
        //$canEdit = Auth::id() === $this->creator_id || $this->members->where('id', Auth::id())->where('pivot.role', 'admin')->exists();
        $canEdit = true;
        $canDelete = Auth::id() === $this->creator_id;
        $canAddTasks = Auth::id() === $this->creator_id;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'status' => $this->status ?? 'draft',
            'type' => [
                'id' => $this->type->id ?? null,
                'name' => $this->type->name ?? 'Unknown',
            ],
            'team' => $this->when($this->team, function () {
                return [
                    'id' => $this->team->id,
                    'name' => $this->team->name,
                ];
            }),
            'is_private' => $this->is_private,
            'settings' => $this->settings ?? [
                'enable_voting' => true,
                'allow_comments' => true,
                'show_creator' => true,
            ],
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'creator' => [
                'id' => $this->creator->id,
                'name' => $this->creator->name,
                'email' => $this->creator->email,
            ],
            'is_starred' => $this->isStarredByUser(Auth::user()),
            'members_count' => $this->members->count(),
            "members" => $filteredMembers, // Use filtered members collection here
            'items' => $this->when($this->items, function () {
                return $this->items->map(function($item) {
                    return [
                        'id' => $item->id,
                        'title' => $item->title,
                        'description' => $item->description,
                        'status' => $item->status,
                        'created_at' => $item->created_at,
                        'updated_at' => $item->updated_at,
                        'creator' => [
                            'id' => $item->creator->id ?? null,
                            'name' => $item->creator->name ?? 'Unknown',
                        ],
                        'votes_count' => $item->votes_count ?? 0,
                        'comments_count' => $item->comments_count ?? 0,
                        'views_count' => $item->views_count ?? 0,
                        'is_voted' => $this->when(Auth::check(), function () use ($item) {
                            return $item->isVotedBy(Auth::user());
                        }, false),
                    ];
                });
            }, []),
            // In your BoardResource class
            'items_by_status' => $this->when($this->items, function () {
                // Group items by status
                $groupedItems = $this->items->groupBy('status');

                // Transform the grouped collection into the desired format
                $result = [];

                // Create empty arrays for each status, even if there are no items
                $defaultStatuses = ['todo', 'in-progress', 'done']; // Add all your possible statuses here
                foreach ($defaultStatuses as $status) {
                    $result[$status] = [];
                }

                // Fill with actual items
                foreach ($groupedItems as $status => $items) {
                    $result[$status] = $items->map(function ($item) {
                        return [
                            'id' => (string) $item->id,
                            'content' => $item->title,
                            'description' => $item->description,
                            'status' => $item->status,
                            'created_at' => $item->created_at,
                            'updated_at' => $item->updated_at,
                            'priority' => $item->Priority ?? 'medium',
                            'creator' => [
                                'id' => $item->creator->id ?? null,
                                'name' => $item->creator->name ?? 'Unknown',
                            ],
                            'votes_count' => $item->votes_count ?? 0,
                            'comments_count' => $item->comments_count ?? 0,
                            'views_count' => $item->views_count ?? 0,
                            "tasks" => $item->tasks,
                            "canAddTask" => Auth::user()->id === $this->creator_id || Auth::id() === $item->creator_id,
                            'is_voted' => Auth::check() ? $item->isVotedBy(Auth::user()) : false,
                        ];
                    })->values()->all(); // Use values() to reindex and all() to convert to array
                }

                return $result;
            }, []),
            'can_edit' => $canEdit,
            'can_delete' => $canDelete,
            'canAddTasks' => $canAddTasks,
        ];
    }

     /**
     * Check if the board is starred by the user
     *
     * @param \App\Models\User $user
     * @return bool
     */
    protected function isStarredByUser($user)
    {
        return true;
    }

    /**
     * Get additional data that should be returned with the resource array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function with($request)
    {
        return [
            'auth' => [
                'user' => Auth::check() ? Auth::user()->only('id', 'name', 'email') : null,
            ],
        ];
    }
}
