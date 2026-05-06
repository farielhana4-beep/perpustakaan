<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public string|int $otp)
    {
    }

    public function build(): self
    {
        return $this->subject('Kode OTP Anda')
            ->view('emails.otp')
            ->with([
                'otp' => $this->otp,
            ]);
    }
}
