<?php

namespace Tests\Feature;

use App\Mail\BorrowNotification;
use App\Mail\ReturnNotification;
use App\Models\Book;
use App\Models\Borrowing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class BorrowingEmailNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_borrow_and_return_actions_send_member_notifications(): void
    {
        Mail::fake();

        $member = User::query()->create([
            'name' => 'Member One',
            'email' => 'member@example.com',
            'password' => 'password',
            'role' => 'member',
        ]);

        $book = Book::query()->create([
            'title' => 'Refactoring',
            'author' => 'Martin Fowler',
            'isbn' => '9780201485677',
            'stock' => 5,
            'cover' => null,
            'category_id' => null,
        ]);

        $this->actingAs($member)->post('/member/borrowings', [
            'book_id' => $book->id,
            'quantity' => 1,
        ])->assertRedirect();

        Mail::assertSent(BorrowNotification::class, function (BorrowNotification $mail) use ($member, $book): bool {
            return $mail->borrowing->user_id === $member->id
                && $mail->borrowing->book_id === $book->id
                && $mail->borrowing->quantity === 1;
        });

        $borrowing = Borrowing::query()->firstOrFail();

        $this->actingAs($member)->post("/member/borrowings/{$borrowing->id}/return", [
            'quantity' => 1,
        ])->assertRedirect();

        Mail::assertSent(ReturnNotification::class, function (ReturnNotification $mail): bool {
            return $mail->borrowing->remaining === 0
                && $mail->borrowing->status === Borrowing::STATUS_RETURNED;
        });
    }
}
