<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Borrowing;
use App\Models\Category;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        Borrowing::syncOverdueStatuses();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'books' => Book::count(),
                'categories' => Category::count(),
                'users' => User::count(),
                'borrowings' => Borrowing::count(),
            ],
            'recentBorrowings' => Borrowing::with(['user', 'book'])
                ->orderByDesc('borrowed_at')
                ->take(6)
                ->get(),
        ]);
    }
}
