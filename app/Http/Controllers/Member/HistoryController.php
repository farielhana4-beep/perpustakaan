<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Borrowing;
use App\Models\Setting;
use Inertia\Inertia;

class HistoryController extends Controller
{
    public function index()
    {
        Borrowing::syncOverdueStatuses();
        $settings = Setting::current();

        return Inertia::render('Member/History/Index', [
            'borrowings' => Borrowing::with('book')
                ->where('user_id', auth()->id())
                ->orderByDesc('borrowed_at')
                ->get(),
            'settings' => $settings->only('fine_per_day', 'max_borrow_days', 'currency', 'max_books_per_user'),
        ]);
    }
}
