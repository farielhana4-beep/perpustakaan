<?php

namespace App\Mail;

use App\Models\Borrowing;
use App\Models\Setting;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OverdueNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Borrowing $borrowing)
    {
    }

    public function build(): self
    {
        $borrowing = $this->borrowing->loadMissing(['user', 'book']);
        $settings = Setting::current();
        $daysOverdue = $borrowing->due_date?->copy()->startOfDay()->diffInDays(now()->startOfDay()) ?? 0;

        return $this->subject('Overdue Book Reminder')
            ->view('emails.overdue')
            ->with([
                'member' => $borrowing->user->name,
                'book' => $borrowing->book->title,
                'due' => $borrowing->due_date,
                'daysOverdue' => $daysOverdue,
                'fine' => $borrowing->fine_amount,
                'currency' => $settings->currency,
                'quantity' => $borrowing->quantity,
            ]);
    }
}
