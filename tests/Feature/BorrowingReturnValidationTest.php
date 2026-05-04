<?php

namespace Tests\Feature;

use App\Models\Book;
use App\Models\Borrowing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BorrowingReturnValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_partial_return_rejects_quantities_above_the_remaining_amount(): void
    {
        $member = User::factory()->create([
            'role' => 'member',
        ]);

        $book = Book::query()->create([
            'title' => 'Clean Architecture',
            'author' => 'Robert C. Martin',
            'isbn' => '9780134494166',
            'stock' => 5,
            'cover' => null,
            'category_id' => null,
        ]);

        $this->actingAs($member)->post('/member/borrowings', [
            'book_id' => $book->id,
            'quantity' => 3,
        ])->assertRedirect();

        $borrowing = Borrowing::query()->firstOrFail();

        $response = $this->actingAs($member)->post("/member/borrowings/{$borrowing->id}/return", [
            'quantity' => 4,
        ]);

        $response->assertSessionHasErrors('quantity');

        $borrowing->refresh();
        $book->refresh();

        $this->assertSame(0, $borrowing->returned_quantity);
        $this->assertSame(2, $book->stock);
    }
}
