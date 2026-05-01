<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Borrowing;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HistoryController extends Controller
{
    public function index(Request $request)
    {
        Borrowing::syncOverdueStatuses();
        $settings = Setting::current();
        $query = Borrowing::with('book');

        if (auth()->user()->role === 'member') {
            $query->where('user_id', auth()->id());
        }

        if ($request->filled('status')) {
            $query->where('status', $request->string('status')->toString());
        }

        return Inertia::render('Member/History/Index', [
            'borrowings' => $query
                ->orderByDesc('borrowed_at')
                ->paginate(10)
                ->withQueryString(),
            'filters' => $request->only(['status']),
            'statusOptions' => [
                ['value' => '', 'label' => 'All status'],
                ['value' => Borrowing::STATUS_BORROWED, 'label' => 'Borrowed'],
                ['value' => Borrowing::STATUS_OVERDUE, 'label' => 'Overdue'],
                ['value' => Borrowing::STATUS_RETURNED, 'label' => 'Returned'],
                ['value' => Borrowing::STATUS_LOST, 'label' => 'Lost'],
            ],
            'settings' => $settings->only('fine_per_day', 'max_borrow_days', 'currency', 'max_books_per_user'),
        ]);
    }
}
