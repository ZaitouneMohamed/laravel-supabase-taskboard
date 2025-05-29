<?php

use App\Http\Controllers\Dashboard\Board\BoardItemController;
use App\Http\Controllers\Dashboard\Board\BoardMembersController;
use App\Http\Controllers\Dashboard\BoardController;
use App\Http\Controllers\Dashboard\Task\TaskController;
use App\Http\Controllers\Dashboard\TeamController;
use App\Http\Controllers\Dashboard\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    //
    Route::resource("boards" , BoardController::class);
    //
    Route::controller(BoardItemController::class)->name('boardItem.')->group(function() {
        Route::put("switchBoardStatus/{boardItem}" , "switchBoardStatus")->name("switchBoardStatus");
    });
    //x
    Route::get("boards/{board}/items/create" , [BoardItemController::class , "boards.items.create"]);
    Route::post("boards/items/store" , [BoardItemController::class , "store"])->name("boards.items.store");
    //
    Route::controller(BoardMembersController::class)->name('boards.members.')->group(function() {
        Route::post("inviteMembers/{board}" , "inviteMembers")->name("store");
        Route::delete("deleteMember/{board}/{user}" , "deleteMember")->name("delete");
    });

    // Tasks routes
    Route::controller(TaskController::class)->name('task.')->prefix("task")->group(function() {
        Route::post("store" , "store")->name('store');
        Route::delete("delete/{task}" , "delete")->name('delete');
        Route::put('/tasks/{task}', 'update')->name('update');
        Route::put("toogleTask/{task}" , "toogleTask")->name('toogleTask');
    });
    // params controller
    Route::resource("user" , UserController::class);
    Route::resource("team" , TeamController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
