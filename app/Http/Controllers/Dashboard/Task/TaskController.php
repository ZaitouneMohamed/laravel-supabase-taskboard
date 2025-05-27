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

    public function update(Request $request, Task $task)
    {
        $task->update([
            'title' => $request->title,
        ]);
        return redirect()->back();
    }

    public function delete(Task $task)
    {
        $task->delete();
        return redirect()->back();
    }

    public function toogleTask(Task $task)
    {
        $task->completed = !$task->completed;
        $task->save();
        return redirect()->back();
    }
}
