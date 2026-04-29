<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBorrowingRequest;
use App\Models\Book;
use App\Models\Borrowing;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BorrowingController extends Controller
{
    public function index(Request $request)
    {
        Borrowing::syncOverdueStatuses();

        $status = $request->string('status')->toString();
        $settings = Setting::current();

        $borrowings = Borrowing::with(['user', 'book'])
            ->forStatus($status)
            ->orderByDesc('borrowed_at')
            ->get();

        return Inertia::render('Admin/Circulation/Index', [
            'borrowings' => $borrowings,
            'books' => Book::orderBy('title')->get(['id', 'title', 'stock', 'image']),
            'members' => User::where('role', 'member')->orderBy('name')->get(['id', 'name', 'email']),
            'filters' => [
                'status' => $status,
            ],
            'statusOptions' => [
                ['value' => '', 'label' => 'All statuses'],
                ['value' => Borrowing::STATUS_BORROWED, 'label' => 'Borrowed'],
                ['value' => Borrowing::STATUS_OVERDUE, 'label' => 'Overdue'],
                ['value' => Borrowing::STATUS_RETURNED, 'label' => 'Returned'],
                ['value' => Borrowing::STATUS_LOST, 'label' => 'Lost'],
            ],
            'settings' => $settings->only('fine_per_day', 'max_borrow_days', 'currency', 'max_books_per_user'),
            'summary' => [
                'borrowed' => Borrowing::query()->where('status', Borrowing::STATUS_BORROWED)->count(),
                'overdue' => Borrowing::query()->where('status', Borrowing::STATUS_OVERDUE)->count(),
                'returned' => Borrowing::query()->where('status', Borrowing::STATUS_RETURNED)->count(),
                'lost' => Borrowing::query()->where('status', Borrowing::STATUS_LOST)->count(),
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

        $activeQuantity = Borrowing::query()
            ->where('user_id', $targetUserId)
            ->active()
            ->sum('quantity');

        if (($activeQuantity + $quantity) > $settings->max_books_per_user) {
            return back()->with('error', 'User has reached the borrowing limit.');
        }

        $failed = false;
        $message = null;

        DB::transaction(function () use ($data, $targetUserId, $settings, $quantity, &$failed, &$message): void {
            $book = Book::lockForUpdate()->findOrFail($data['book_id']);

            if ($book->stock < $quantity) {
                $failed = true;
                $message = 'Stock tidak mencukupi';

                return;
            }

            Borrowing::create([
                'user_id' => $targetUserId,
                'book_id' => $book->id,
                'quantity' => $quantity,
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

        return back()->with('success', 'Book borrowed');
    }

    public function returnBook(Request $request, Borrowing $borrowing)
    {
        $this->authorizeBorrowing($request, $borrowing);

        if (in_array($borrowing->status, [Borrowing::STATUS_RETURNED, Borrowing::STATUS_LOST], true)) {
            return back()->with('error', 'Borrowing already closed');
        }

        DB::transaction(function () use ($borrowing): void {
            $book = Book::lockForUpdate()->findOrFail($borrowing->book_id);

            $borrowing->update([
                'returned_at' => now(),
                'status' => Borrowing::STATUS_RETURNED,
                'fine' => $borrowing->calculateFine(now()),
            ]);

            $book->increment('stock', $borrowing->quantity);
        });

        return back()->with('success', 'Book returned');
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
