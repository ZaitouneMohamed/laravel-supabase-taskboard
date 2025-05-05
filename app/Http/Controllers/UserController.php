<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        return User::latest()->paginate(5);
    }

    public function processUser(Request $request)
    {
        $user = User::find($request->userId);
        return response()->json(['success' => true, 'user' => $user]);
    }
}
