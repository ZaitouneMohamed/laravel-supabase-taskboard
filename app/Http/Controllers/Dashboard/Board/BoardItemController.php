<?php

namespace App\Http\Controllers\Dashboard\Board;

use App\Http\Controllers\Controller;
use App\Http\Resources\Board\BoardResource;
use App\Models\Board;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BoardItemController extends Controller
{
    public function create($board)
    {
        $board = Board::findOrFail($board);
        // Check if user has access to create items on this board
        if (($board->is_private && !$board->members->contains('id', Auth::id()) && $board->creator_id !== Auth::id()) ||
            ($board->creator_id !== Auth::id())) {
            abort(403, 'You do not have permission to create items on this board.');
        }

        // Load necessary board data for the create form
        $board->load(['creator', 'type', 'members']);

        // Get statuses and priorities based on board type
        $boardType = $board->type;

        // Get standard statuses if not defined in the board type
        $statuses = $boardType->statuses ?? ['todo', 'in progress', 'completed'];

        // Standard priorities
        $priorities = ['low', 'medium', 'high', 'urgent'];
//return new BoardResource($board);
        return Inertia::render('Boards/Items/Create', [
            'board' => new BoardResource($board),
            'auth' => [
                'user' => auth()->user()->only('id', 'name', 'email'),
            ],
            'boardType' => $boardType,
            'statuses' => $statuses,
            'priorities' => $priorities,
        ]);
    }

    public function store(Request $request)
    {
        $board = Board::findOrFail($request->boardId);
        // Check if user has access to create items on this board
        if (($board->is_private && !$board->members->contains('id', Auth::id()) && $board->creator_id !== Auth::id()) ||
            ($board->creator_id !== Auth::id())) {
            abort(403, 'You do not have permission to create items on this board.');
        }

        // Validate the request
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:5000',
            'status' => 'nullable|string|max:50',
            'priority' => 'nullable|string|in:low,medium,high,urgent',
            'due_date' => 'nullable|date',
            'assignee_id' => 'nullable|exists:users,id',
        ]);

        // Create the board item
        $item = $board->items()->create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'status' => $validated['status'] ?? 'todo',
            'priority' => $validated['priority'] ?? 'medium',
            'due_date' => $validated['due_date'] ?? null,
            'assignee_id' => $validated['assignee_id'] ?? null,
            'creator_id' => Auth::id(),
        ]);

        // Record activity
        $board->activities()->create([
            'user_id' => Auth::id(),
            'type' => 'item_created',
            'description' => 'created a new item',
            'metadata' => [
                'item_id' => $item->id,
                'item_title' => $item->title,
            ],
        ]);

        // Redirect to the board
        return redirect()->route('boards.show', $board->id)
            ->with('success', 'Item created successfully');
    }
}
