<?php

use App\Mail\OverdueNotification;
use App\Models\Borrowing;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::call(function (): void {
    Borrowing::syncOverdueStatuses();

    Borrowing::query()
        ->with(['user', 'book'])
        ->whereDate('due_date', '<', now())
        ->whereIn('status', [Borrowing::STATUS_BORROWED, Borrowing::STATUS_OVERDUE])
        ->chunkById(100, function ($borrowings): void {
            foreach ($borrowings as $borrowing) {
                Mail::to($borrowing->user->email)->send(new OverdueNotification($borrowing));
            }
        });
})->daily();
