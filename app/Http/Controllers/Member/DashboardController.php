<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Borrowing;
use App\Models\Setting;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        Borrowing::syncOverdueStatuses();
        $settings = Setting::current();

        $borrowings = Borrowing::with('book')
            ->where('user_id', auth()->id())
            ->active()
            ->orderByDesc('borrowed_at')
            ->get();

        $alerts = $borrowings->map(function ($borrowing) {
            $dueDate = Carbon::parse($borrowing->due_date);

            return [
                'id' => $borrowing->id,
                'title' => $borrowing->book->title,
                'status' => $borrowing->status,
                'due_date' => $dueDate->toDateString(),
                'days_left' => now()->diffInDays($dueDate, false),
                'fine_amount' => $borrowing->fine_amount,
            ];
        });

        return Inertia::render('Member/Dashboard', [
            'borrowings' => $borrowings,
            'alerts' => $alerts,
            'settings' => $settings->only('fine_per_day', 'max_borrow_days', 'currency', 'max_books_per_user'),
        ]);
    }
}
