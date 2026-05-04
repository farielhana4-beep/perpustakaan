<?php

namespace App\Mail;

use App\Models\Borrowing;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BorrowNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Borrowing $borrowing)
    {
    }

    public function build(): self
    {
        $borrowing = $this->borrowing->loadMissing(['user', 'book']);

        return $this->subject('Book Borrowed')
            ->view('emails.borrow')
            ->with([
                'member' => $borrowing->user->name,
                'book' => $borrowing->book->title,
                'borrowedAt' => $borrowing->borrowed_at,
                'due' => $borrowing->due_date,
                'quantity' => $borrowing->quantity,
            ]);
    }
}
