<?php

namespace App\Http\Controllers\Dashboard\Board;

use App\Http\Controllers\Controller;
use App\Models\Board;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BoardMembersController extends Controller
{
    public function inviteMembers(Request $request, Board $board)
    {
        abort_if($board->creator_id !== Auth::id(), 403, "You cant't add member" . $board->creator->name);

        // Validate the incoming request
        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
        ]);
        // Attach each user ID directly
        foreach ($request->user_ids as $userId) {
            $board->members()->attach($userId, ['role' => 'member']);
        }

        return redirect()->back()->with([
            "success" => "members atached with success"
        ]);
    }

    public function deleteMember(Board $board , User $user)
    {
        abort_if($board->creator_id !== Auth::id(), 403, "You cant't delete member" . $board->creator->name);
        dd($user);
        $board->members()->detach($user);

         return redirect()->back()->with([
            "success" => "member detached with success"
        ]);
    }
}
