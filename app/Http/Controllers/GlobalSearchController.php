<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Borrowing;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GlobalSearchController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $term = trim($request->string('q')->toString() ?: $request->string('search')->toString());

        if ($term === '') {
            return response()->json([
                'books' => [],
                'users' => [],
                'borrowings' => [],
            ]);
        }

        $books = Book::query()
            ->where(function ($query) use ($term): void {
                $query->where('title', 'like', "%{$term}%")
                    ->orWhere('author', 'like', "%{$term}%")
                    ->orWhere('isbn', 'like', "%{$term}%");
            })
            ->orderBy('title')
            ->limit(5)
            ->get(['id', 'title', 'author', 'stock']);

        $users = $request->user()?->role !== 'super_admin'
            ? collect()
            : User::query()
                ->where(function ($query) use ($term): void {
                    $query->where('name', 'like', "%{$term}%")
                        ->orWhere('email', 'like', "%{$term}%");
                })
                ->orderBy('name')
                ->limit(5)
                ->get(['id', 'name', 'email', 'role']);

        $borrowings = Borrowing::query()
            ->with(['user:id,name', 'book:id,title'])
            ->when($request->user()?->role === 'member', function ($query) use ($request): void {
                $query->where('user_id', $request->user()->id);
            })
            ->where(function ($query) use ($term): void {
                $query->whereHas('user', function ($userQuery) use ($term): void {
                    $userQuery->where('name', 'like', "%{$term}%")
                        ->orWhere('email', 'like', "%{$term}%");
                })->orWhereHas('book', function ($bookQuery) use ($term): void {
                    $bookQuery->where('title', 'like', "%{$term}%")
                        ->orWhere('author', 'like', "%{$term}%");
                });
            })
            ->orderByDesc('borrowed_at')
            ->limit(5)
            ->get(['id', 'user_id', 'book_id', 'status', 'due_date']);

        return response()->json([
            'books' => $books,
            'users' => $users,
            'borrowings' => $borrowings,
        ]);
    }
}
