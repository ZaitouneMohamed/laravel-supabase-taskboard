<?php

use App\Http\Controllers\Api\Tasks\TaskController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// routes/api.php
Route::get('/users', [UserController::class, 'index']);
Route::post('/process-user', [UserController::class, 'processUser']);

Route::controller(TaskController::class)->group(function() {
    Route::post("");
});
