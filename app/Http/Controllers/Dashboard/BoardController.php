<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Resources\Board\BoardResource;
use App\Models\Board;
use App\Models\BoardType;
use App\Models\Team;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Str;

class BoardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $boards = Board::with('creator')->latest()->paginate(5);

        return Inertia::render('Boards/Index', [
            'boards' => $boards,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $boardTypes = BoardType::all();
        $teams = Auth::user()->teams;
        // Using static values for board types and teams until we build those models

        return Inertia::render('Boards/Create', [
            'boardTypes' => $boardTypes,
            'teams' => $teams,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            // Validate the request
            $validated = $request->validate([
                'name' => 'required|string|min:3|max:255',
                'description' => 'nullable|string|max:1000',
                'status' => 'nullable|string|in:active,draft',
                'type_id' => 'required|exists:board_types,id',
                'team_id' => 'nullable|exists:teams,id',
                'is_private' => 'nullable|boolean',
                'settings' => 'nullable|array',
                'template_id' => 'nullable|string',
            ]);

            DB::transaction(function () use ($validated) {
                // Create the board
                $board = Board::create([
                    'name' => $validated['name'],
                    'slug' => Str::slug($validated['name']),
                    'description' => $validated['description'] ?? null,
                    'status' => $validated['status'] ?? 'active',
                    'type_id' => $validated['type_id'],
                    'team_id' => !empty($validated['team_id']) ? $validated['team_id'] : null,
                    'is_private' => $validated['is_private'] ?? false,
                    'settings' => $validated['settings'] ?? [
                        'enable_voting' => true,
                        'allow_comments' => true,
                        'show_creator' => true,
                    ],
                    'template_id' => $validated['template_id'] ?? null,
                    'creator_id' => auth()->id(),
                ]);

                // Add creator as board member
                $board->members()->attach(auth()->id(), ['role' => 'owner']);

                return $board;
            });

            return redirect()->route('boards.index')
                ->with('success', 'Board created successfully.');

        } catch (Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'An error occurred while creating the board. Please try again.');
        }
    }

    /**
     * Display the specified board.
     *
     * @param  \App\Models\Board  $board
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $boards = Board::findOrFail($id);

        if ($boards->is_private && !$boards->members->contains('id', Auth::id()) && $boards->creator_id !== Auth::id()) {
            abort(403, 'You do not have permission to view this board.');
        }

        $boards->load([
            'creator',
            'type',
            'team',
            'members',
            'items' => function($query) {
                $query->latest()->take(10);
            }
        ]);


        // Get users from the team who aren't already board members and aren't the current user
        $usersToInvite = Team::findOrFail($boards->team_id)
            ->users()
            ->whereNot('users.id', Auth::id()) // Exclude the current authenticated user
            ->whereNotIn('users.id', function($query) use ($boards) {
                $query->select('user_id')
                    ->from('board_members') // Assuming your pivot table is named board_user
                    ->where('board_id', $boards->id);
            })
            ->get();

        return Inertia::render('Boards/Show', [
            'board' => new BoardResource($boards),
            "usersToInvite" => $usersToInvite
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Board $board)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Board $board)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Board $board)
    {
        //
    }


}
