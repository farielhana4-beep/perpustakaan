<?php

namespace App\Http\Middleware;

use App\Models\Book;
use App\Models\Borrowing;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => fn () => $request->user()
                    ? $request->user()->only('id', 'name', 'email', 'role')
                    : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'status' => fn () => $request->session()->get('status'),
            ],
            'settings' => fn () => Setting::current()->only(
                'fine_per_day',
                'max_borrow_days',
                'currency',
                'max_books_per_user',
            ),
            'notifications' => fn () => $this->notifications($request),
        ];
    }

    private function notifications(Request $request): array
    {
        $user = $request->user();

        if (! $user) {
            return [];
        }

        Borrowing::syncOverdueStatuses();

        if ($user->role === 'member') {
            return Borrowing::query()
                ->with('book:id,title')
                ->where('user_id', $user->id)
                ->active()
                ->orderBy('due_date')
                ->get()
                ->filter(function (Borrowing $borrowing): bool {
                    if (! $borrowing->due_date) {
                        return false;
                    }

                    $daysLeft = now()->startOfDay()->diffInDays($borrowing->due_date->copy()->startOfDay(), false);

                    return $daysLeft <= 2;
                })
                ->take(6)
                ->map(function (Borrowing $borrowing): array {
                    $daysLeft = now()->startOfDay()->diffInDays($borrowing->due_date->copy()->startOfDay(), false);

                    return [
                        'id' => $borrowing->id,
                        'title' => $borrowing->book?->title ?? 'Borrowing',
                        'message' => $daysLeft < 0
                            ? 'Book overdue. Return it as soon as possible.'
                            : 'Due soon. Please return before the deadline.',
                        'status' => $daysLeft < 0 ? Borrowing::STATUS_OVERDUE : 'due_soon',
                        'due_date' => optional($borrowing->due_date)->toDateString(),
                        'days_left' => $daysLeft,
                    ];
                })
                ->values()
                ->all();
        }

        return [
            [
                'id' => 'low-stock',
                'title' => 'Low stock books',
                'message' => Book::query()->lowStock()->count() . ' books need restock attention.',
                'status' => 'alert',
            ],
            [
                'id' => 'overdue',
                'title' => 'Overdue borrowings',
                'message' => Borrowing::query()->overdue()->count() . ' borrowing records are overdue right now.',
                'status' => Borrowing::STATUS_OVERDUE,
            ],
        ];
    }
}
