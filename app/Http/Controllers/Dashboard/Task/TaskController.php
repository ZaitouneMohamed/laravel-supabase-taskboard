<?php

namespace App\Http\Controllers\Dashboard\Task;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function store(Request $request)
    {
        Task::create([
            'board_item_id' => $request->board_item_id,
            'title' => $request->title,
        ]);
        return redirect()->back();
    }
}
