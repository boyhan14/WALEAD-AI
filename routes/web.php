<?php

use App\Http\Controllers\ApprovalController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InboxController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SimulatorController;
use App\Http\Controllers\SystemHealthController;
use App\Http\Controllers\WhatsAppSettingsController;
use App\Http\Controllers\WorkspaceController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', DashboardController::class)
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Workspace Switching
    Route::post('/workspaces/{workspace}/switch', [WorkspaceController::class, 'switch'])->name('workspaces.switch');

    Route::middleware('workspace')->group(function () {
        // CRM & Catalog
        Route::resource('customers', CustomerController::class)->except(['store', 'update', 'destroy']);
        Route::middleware('workspace.role:OWNER,ADMIN,MANAGER')->group(function () {
            Route::post('customers', [CustomerController::class, 'store'])->name('customers.store');
            Route::put('customers/{customer}', [CustomerController::class, 'update'])->name('customers.update');
            Route::patch('customers/{customer}', [CustomerController::class, 'update']);
            Route::delete('customers/{customer}', [CustomerController::class, 'destroy'])->name('customers.destroy');
        });
        Route::resource('products', ProductController::class);
        Route::resource('orders', OrderController::class);

        // Inbox
        Route::get('inbox', [InboxController::class, 'index'])->name('inbox.index');
        Route::get('inbox/{conversation}', [InboxController::class, 'show'])->name('inbox.show');
        Route::post('inbox/{conversation}/messages', [InboxController::class, 'storeMessage'])->name('inbox.messages.store');

        // AI Approvals
        Route::get('approvals', [ApprovalController::class, 'index'])->name('approvals.index');
        Route::post('approvals/{approval}', [ApprovalController::class, 'update'])->middleware('workspace.role:OWNER,ADMIN,MANAGER')->name('approvals.update');

        // Simulator
        Route::get('simulator', [SimulatorController::class, 'index'])->name('simulator.index');
        Route::post('simulator', [SimulatorController::class, 'simulate'])->name('simulator.simulate');

        // WhatsApp Settings
        Route::get('settings/whatsapp', [WhatsAppSettingsController::class, 'index'])->name('settings.whatsapp');
        Route::post('settings/whatsapp', [WhatsAppSettingsController::class, 'store'])->middleware('workspace.role:OWNER,ADMIN')->name('settings.whatsapp.store');
        Route::post('settings/whatsapp/test', [WhatsAppSettingsController::class, 'testConnection'])->middleware('workspace.role:OWNER,ADMIN')->name('settings.whatsapp.test');

        // System Health
        Route::get('settings/system-health', [SystemHealthController::class, 'index'])->name('settings.system-health');
    });
});

require __DIR__.'/auth.php';
