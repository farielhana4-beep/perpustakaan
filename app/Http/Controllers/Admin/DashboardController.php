<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Borrowing;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        Borrowing::syncOverdueStatuses();

        $activeBorrowings = Borrowing::query()->active()->get();
        $allBorrowings = Borrowing::query()->with(['book', 'user'])->get();
        $chartData = Borrowing::query()
            ->selectRaw('DATE(borrowed_at) as date, COUNT(*) as total')
            ->where('borrowed_at', '>=', now()->subDays(13)->startOfDay())
            ->groupBy(DB::raw('DATE(borrowed_at)'))
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $dailyBorrowings = collect(range(13, 0))
            ->map(function (int $daysAgo) use ($chartData): array {
                $date = now()->subDays($daysAgo)->toDateString();

                return [
                    'date' => $date,
                    'label' => now()->subDays($daysAgo)->format('d M'),
                    'total' => (int) ($chartData[$date]->total ?? 0),
                ];
            })
            ->values();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_books' => Book::count(),
                'total_users' => User::count(),
                'total_borrowed' => $activeBorrowings->count(),
                'total_overdue' => Borrowing::query()->overdue()->count(),
                'total_fine' => Borrowing::totalFineAmount($allBorrowings),
            ],
            'dailyBorrowings' => $dailyBorrowings,
            'topBooks' => Book::query()
                ->withSum('borrowings as total_borrowed', 'quantity')
                ->orderByDesc('total_borrowed')
                ->orderBy('title')
                ->take(5)
                ->get(['id', 'title', 'author', 'stock', 'image']),
            'lowStockBooks' => Book::query()
                ->lowStock()
                ->orderBy('stock')
                ->take(6)
                ->get(['id', 'title', 'author', 'stock', 'image']),
            'recentBorrowings' => Borrowing::with(['user', 'book'])
                ->orderByDesc('borrowed_at')
                ->take(6)
                ->get(),
        ]);
    }
}
