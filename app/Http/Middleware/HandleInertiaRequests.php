<?php

namespace App\Http\Middleware;

use App\Models\Book;
use App\Models\Borrowing;
use App\Models\Setting;
use Illuminate\Support\Facades\App;
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
        $settings = Setting::current();

        return [
            ...parent::share($request),
            'locale' => App::getLocale(),
            'locales' => config('app.supported_locales', ['id', 'en']),
            't' => fn () => trans('messages'),
            'auth' => [
                'user' => fn () => $request->user()
                    ? [
                        'id' => $request->user()->id,
                        'name' => $request->user()->name,
                        'username' => $request->user()->username,
                        'email' => $request->user()->email,
                        'role' => $request->user()->role,
                        'bio' => $request->user()->bio,
                        'avatar_path' => $request->user()->avatar_path,
                        'avatar_url' => $request->user()->avatar_url,
                        'updated_at' => $request->user()->updated_at?->toISOString(),
                        'email_verified_at' => $request->user()->email_verified_at?->toISOString(),
                    ]
                    : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'status' => fn () => $request->session()->get('status'),
            ],
            'settings' => fn () => $settings->toArray(),
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
                        'title' => $borrowing->book?->title ?? __('messages.member.latest_borrowings'),
                        'message' => $daysLeft < 0
                            ? __('messages.notifications.book_overdue')
                            : __('messages.notifications.due_soon_message'),
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
                'title' => __('messages.notifications.low_stock_books'),
                'message' => Book::query()->lowStock()->count() . ' ' . __('messages.dashboard.books_need_restock'),
                'status' => 'alert',
            ],
            [
                'id' => 'overdue',
                'title' => __('messages.notifications.borrowing_overdue'),
                'message' => Borrowing::query()->overdue()->count() . ' ' . __('messages.notifications.borrowing_overdue'),
                'status' => Borrowing::STATUS_OVERDUE,
            ],
        ];
    }
}
