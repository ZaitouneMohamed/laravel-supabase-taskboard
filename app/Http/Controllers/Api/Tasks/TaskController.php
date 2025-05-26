<?php

namespace App\Http\Controllers\Api\Tasks;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use PhpParser\Node\Stmt\TryCatch;

class TaskController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                "board_item_id" => "required|exists:board_items,id",
                "title" => "required"
            ]);
            DB::transaction(function () use ($validated) {
                Task::create([
                    'board_item_id' => $validated['board_item_id'],
                    'title' => $validated['title'],
                ]);
            });
            $this->successJsonResponse();
        } catch (\Throwable $th) {
            $this->errorJsonResponse();
        }
    }

    public function switchCompleteStatus(Task $task)
    {
        //abort_if(1 == 1 || 11 == 22);
        try {
            $task->completed = !$task->completed;
            $task->save();
            $this->successJsonResponse();
        } catch (\Throwable $th) {
            $this->errorJsonResponse();
        }

    }

    public function deleteItem() {}
}
