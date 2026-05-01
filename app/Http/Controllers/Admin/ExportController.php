<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Borrowing;
use App\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportController extends Controller
{
    public function __invoke(Request $request): StreamedResponse
    {
        $dataset = $request->string('dataset')->toString();
        $format = $request->string('format')->toString() ?: 'csv';

        [$filename, $headers, $rows] = match ($dataset) {
            'books' => [
                'books-export',
                ['ID', 'Title', 'Author', 'ISBN', 'Category', 'Stock'],
                Book::query()->with('category')->orderBy('title')->get()->map(fn (Book $book) => [
                    $book->id,
                    $book->title,
                    $book->author,
                    $book->isbn,
                    $book->category?->name,
                    $book->stock,
                ])->all(),
            ],
            'users' => [
                'users-export',
                ['ID', 'Name', 'Email', 'Role', 'Created At'],
                User::query()->orderBy('name')->get()->map(fn (User $user) => [
                    $user->id,
                    $user->name,
                    $user->email,
                    $user->role,
                    optional($user->created_at)->toDateTimeString(),
                ])->all(),
            ],
            default => [
                'borrowings-export',
                ['ID', 'User', 'Book', 'Qty', 'Status', 'Borrowed At', 'Due Date', 'Returned At', 'Fine'],
                Borrowing::query()->with(['user', 'book'])->orderByDesc('borrowed_at')->get()->map(fn (Borrowing $borrowing) => [
                    $borrowing->id,
                    $borrowing->user?->name,
                    $borrowing->book?->title,
                    $borrowing->quantity,
                    $borrowing->status,
                    optional($borrowing->borrowed_at)->toDateTimeString(),
                    optional($borrowing->due_date)->toDateTimeString(),
                    optional($borrowing->returned_at)->toDateTimeString(),
                    $borrowing->fine_amount,
                ])->all(),
            ],
        };

        if ($format === 'xls') {
            return response()->streamDownload(function () use ($headers, $rows): void {
                echo '<table border="1"><thead><tr>';

                foreach ($headers as $header) {
                    echo '<th>' . e($header) . '</th>';
                }

                echo '</tr></thead><tbody>';

                foreach ($rows as $row) {
                    echo '<tr>';

                    foreach ($row as $cell) {
                        echo '<td>' . e((string) $cell) . '</td>';
                    }

                    echo '</tr>';
                }

                echo '</tbody></table>';
            }, "{$filename}.xls", [
                'Content-Type' => 'application/vnd.ms-excel; charset=UTF-8',
            ]);
        }

        return response()->streamDownload(function () use ($headers, $rows): void {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, $headers);

            foreach ($rows as $row) {
                fputcsv($handle, $row);
            }

            fclose($handle);
        }, "{$filename}.csv", [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}
