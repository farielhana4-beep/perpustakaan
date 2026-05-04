<?php

namespace App\Mail;

use App\Models\Borrowing;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ReturnNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Borrowing $borrowing)
    {
    }

    public function build(): self
    {
        $borrowing = $this->borrowing->loadMissing(['user', 'book']);

        return $this->subject('Book Returned')
            ->view('emails.return')
            ->with([
                'member' => $borrowing->user->name,
                'book' => $borrowing->book->title,
                'returnedAt' => $borrowing->returned_at ?? now(),
                'remaining' => $borrowing->remaining,
                'fine' => $borrowing->fine_amount,
                'status' => $borrowing->status,
            ]);
    }
}
