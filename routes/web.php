<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PostController;


Route::get('/', [PostController::class, 'index']);
Route::resource('posts', PostController::class)->except('index');
