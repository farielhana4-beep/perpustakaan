<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\BorrowNotification;
use App\Mail\ReturnNotification;
use App\Http\Requests\Admin\StoreBorrowingRequest;
use App\Models\Book;
use App\Models\Borrowing;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class BorrowingController extends Controller
{
    public function index(Request $request)
    {
        Borrowing::syncOverdueStatuses();

        $settings = Setting::current();
        $query = Borrowing::query()->with(['user', 'book']);
        $summaryQuery = Borrowing::query();

        if ($request->user()?->role === 'member') {
            $query->where('user_id', $request->user()->id);
            $summaryQuery->where('user_id', $request->user()->id);
        }

        if ($request->filled('search')) {
            $search = $request->string('search')->trim()->toString();

            $query->where(function ($builder) use ($search): void {
                $builder->whereHas('user', function ($userQuery) use ($search): void {
                    $userQuery->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                })->orWhereHas('book', function ($bookQuery) use ($search): void {
                    $bookQuery->where('title', 'like', "%{$search}%")
                        ->orWhere('author', 'like', "%{$search}%")
                        ->orWhere('isbn', 'like', "%{$search}%");
                });
            });
        }

        $status = $request->string('status')->toString();

        if ($status !== '') {
            $query->forStatus($status);
        }

        if ($request->filled('date')) {
            $query->whereDate('borrowed_at', $request->date('date'));
        }

        $sort = $request->string('sort')->toString() ?: 'latest';

        if ($sort === 'oldest') {
            $query->orderBy('borrowed_at');
        } else {
            $query->orderByDesc('borrowed_at');
        }

        return Inertia::render('Admin/Circulation/Index', [
            'borrowings' => $query->paginate(10)->withQueryString(),
            'books' => Book::orderBy('title')->get(['id', 'title', 'stock', 'image']),
            'members' => User::where('role', 'member')->orderBy('name')->get(['id', 'name', 'email']),
            'filters' => $request->all(),
            'statusOptions' => [
                ['value' => '', 'label' => 'All statuses'],
                ['value' => Borrowing::STATUS_BORROWED, 'label' => 'Borrowed'],
                ['value' => Borrowing::STATUS_OVERDUE, 'label' => 'Overdue'],
                ['value' => Borrowing::STATUS_RETURNED, 'label' => 'Returned'],
                ['value' => Borrowing::STATUS_LOST, 'label' => 'Lost'],
            ],
            'settings' => $settings->only('fine_per_day', 'max_borrow_days', 'currency', 'max_books_per_user'),
            'summary' => [
                'borrowed' => (clone $summaryQuery)->where('status', Borrowing::STATUS_BORROWED)->count(),
                'overdue' => (clone $summaryQuery)->where('status', Borrowing::STATUS_OVERDUE)->count(),
                'returned' => (clone $summaryQuery)->where('status', Borrowing::STATUS_RETURNED)->count(),
                'lost' => (clone $summaryQuery)->where('status', Borrowing::STATUS_LOST)->count(),
            ],
        ]);
    }

    public function store(StoreBorrowingRequest $request)
    {
        $settings = Setting::current();
        $isMemberRequest = $request->routeIs('member.*');

        $data = $request->validated();
        $quantity = (int) $data['quantity'];
        $targetUserId = $isMemberRequest ? $request->user()->id : (int) $data['user_id'];
        $borrowing = null;

        $activeQuantity = (int) (Borrowing::query()
            ->where('user_id', $targetUserId)
            ->active()
            ->selectRaw('COALESCE(SUM(quantity - COALESCE(returned_quantity, 0)), 0) as active_quantity')
            ->first()?->active_quantity ?? 0);

        if (($activeQuantity + $quantity) > $settings->max_books_per_user) {
            return back()->with('error', 'User has reached the borrowing limit.');
        }

        $failed = false;
        $message = null;

        DB::transaction(function () use ($data, $targetUserId, $settings, $quantity, &$failed, &$message, &$borrowing): void {
            $book = Book::lockForUpdate()->findOrFail($data['book_id']);

            if ($book->stock < $quantity) {
                $failed = true;
                $message = 'Stock tidak mencukupi';

                return;
            }

            $borrowing = Borrowing::create([
                'user_id' => $targetUserId,
                'book_id' => $book->id,
                'quantity' => $quantity,
                'returned_quantity' => 0,
                'borrowed_at' => now(),
                'due_date' => now()->addDays($settings->max_borrow_days),
                'returned_at' => null,
                'status' => Borrowing::STATUS_BORROWED,
                'fine' => 0,
            ]);

            $book->decrement('stock', $quantity);
        });

        if ($failed) {
            return back()->with('error', $message);
        }

        if ($borrowing) {
            $borrowing->loadMissing(['user', 'book']);

            Mail::to($borrowing->user->email)->send(new BorrowNotification($borrowing));
        }

        return back()->with('success', 'Book borrowed. Email notification sent.');
    }

    public function returnBook(Request $request, Borrowing $borrowing)
    {
        $this->authorizeBorrowing($request, $borrowing);

        if (in_array($borrowing->status, [Borrowing::STATUS_RETURNED, Borrowing::STATUS_LOST], true)) {
            return back()->with('error', 'Borrowing already closed');
        }

        try {
            $data = $request->validate([
                'quantity' => ['required', 'integer', 'min:1'],
            ]);

            DB::transaction(function () use ($borrowing, $data): void {
                $borrowing = Borrowing::query()->lockForUpdate()->findOrFail($borrowing->id);

                if (in_array($borrowing->status, [Borrowing::STATUS_RETURNED, Borrowing::STATUS_LOST], true)) {
                    throw ValidationException::withMessages([
                        'quantity' => 'Borrowing already closed',
                    ]);
                }

                $quantity = (int) $data['quantity'];
                $remaining = $borrowing->remaining;

                if ($quantity > $remaining) {
                    throw ValidationException::withMessages([
                        'quantity' => 'Return exceeds borrowed amount',
                    ]);
                }

                $book = Book::lockForUpdate()->findOrFail($borrowing->book_id);

                $borrowing->increment('returned_quantity', $quantity);
                $book->increment('stock', $quantity);

                if ($borrowing->remaining === 0) {
                    $borrowing->update([
                        'returned_at' => now(),
                        'status' => Borrowing::STATUS_RETURNED,
                        'fine' => $borrowing->calculateFine(now()),
                    ]);
                }
            });
        } catch (ValidationException $exception) {
            return back()->withErrors($exception->errors());
        }

        $borrowing->refresh()->loadMissing(['user', 'book']);

        Mail::to($borrowing->user->email)->send(new ReturnNotification($borrowing));

        return back()->with('success', 'Book returned. Email notification sent.');
    }

    public function returnAll(Request $request, Borrowing $borrowing)
    {
        $this->authorizeBorrowing($request, $borrowing);

        if (in_array($borrowing->status, [Borrowing::STATUS_RETURNED, Borrowing::STATUS_LOST], true)) {
            return back()->with('error', 'Borrowing already closed');
        }

        DB::transaction(function () use ($borrowing): void {
            $borrowing = Borrowing::query()->lockForUpdate()->findOrFail($borrowing->id);

            if (in_array($borrowing->status, [Borrowing::STATUS_RETURNED, Borrowing::STATUS_LOST], true)) {
                throw ValidationException::withMessages([
                    'quantity' => 'Borrowing already closed',
                ]);
            }

            $remaining = $borrowing->remaining;

            if ($remaining <= 0) {
                throw ValidationException::withMessages([
                    'quantity' => 'Borrowing already closed',
                ]);
            }

            $book = Book::lockForUpdate()->findOrFail($borrowing->book_id);

            $borrowing->update([
                'returned_quantity' => $borrowing->quantity,
                'returned_at' => now(),
                'status' => Borrowing::STATUS_RETURNED,
                'fine' => $borrowing->calculateFine(now()),
            ]);

            $book->increment('stock', $remaining);
        });

        $borrowing->refresh()->loadMissing(['user', 'book']);

        Mail::to($borrowing->user->email)->send(new ReturnNotification($borrowing));

        return back()->with('success', 'Book returned. Email notification sent.');
    }

    public function markLost(Request $request, Borrowing $borrowing)
    {
        $this->authorizeBorrowing($request, $borrowing);

        if (in_array($borrowing->status, [Borrowing::STATUS_RETURNED, Borrowing::STATUS_LOST], true)) {
            return back()->with('error', 'Borrowing already closed');
        }

        $borrowing->update([
            'returned_at' => now(),
            'status' => Borrowing::STATUS_LOST,
            'fine' => $borrowing->calculateFine(now()),
        ]);

        return back()->with('success', 'Book marked as lost');
    }

    private function authorizeBorrowing(Request $request, Borrowing $borrowing): void
    {
        if ($request->user()->role === 'member' && $borrowing->user_id !== $request->user()->id) {
            abort(403);
        }
    }
}
