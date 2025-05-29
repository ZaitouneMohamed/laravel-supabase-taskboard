<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\StoreRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function create()
    {
        return Inertia::render('users/Create');
    }

    public function store(StoreRequest $request)
    {
        $validated = $request->validated();

        // Hash the password
        $validated['password'] = Hash::make($validated['password']);

        // Create the user
        User::create($validated);

        return redirect()->route('user.index')
            ->with('success', 'User created successfully.');
    }
}
