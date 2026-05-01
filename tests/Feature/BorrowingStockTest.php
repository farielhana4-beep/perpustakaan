<?php

namespace Tests\Feature;

use App\Models\Book;
use App\Models\Borrowing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BorrowingStockTest extends TestCase
{
    use RefreshDatabase;

    public function test_borrowing_multiple_quantity_decrements_stock_and_return_restores_it(): void
    {
        $member = User::factory()->create([
            'role' => 'member',
        ]);

        $book = Book::query()->create([
            'title' => 'The Pragmatic Programmer',
            'author' => 'Andrew Hunt',
            'isbn' => '9780201616224',
            'stock' => 10,
            'cover' => null,
            'category_id' => null,
        ]);

        $response = $this->actingAs($member)->post('/member/borrowings', [
            'book_id' => $book->id,
            'quantity' => 3,
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('borrowings', [
            'user_id' => $member->id,
            'book_id' => $book->id,
            'quantity' => 3,
            'status' => Borrowing::STATUS_BORROWED,
        ]);

        $book->refresh();
        $this->assertSame(7, $book->stock);

        $borrowing = Borrowing::query()->firstOrFail();

        $returnResponse = $this->actingAs($member)->post("/member/borrowings/{$borrowing->id}/return");

        $returnResponse->assertRedirect();

        $borrowing->refresh();
        $book->refresh();

        $this->assertSame(Borrowing::STATUS_RETURNED, $borrowing->status);
        $this->assertSame(10, $book->stock);
    }
}
