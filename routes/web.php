<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('pengajuan', 'pengajuan')->name('pengajuan');
    Route::inertia('peminjaman', 'peminjaman')->name('peminjaman');
});

require __DIR__.'/settings.php';
