<?php

use App\Http\Controllers\Dashboard\Board\BoardItemController;
use App\Http\Controllers\Dashboard\Board\BoardMembersController;
use App\Http\Controllers\Dashboard\BoardController;
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
    //x
    Route::get("boards/{board}/items/create" , [BoardItemController::class , "create"]);
    Route::post("boards/items/store" , [BoardItemController::class , "store"])->name("boards.items.store");
    //
    Route::controller(BoardMembersController::class)->name('boards.members.')->group(function() {
        Route::post("inviteMembers/{board}" , "inviteMembers")->name("store");
        Route::delete("deleteMember/{board}" , "deleteMember")->name("delete");

    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
