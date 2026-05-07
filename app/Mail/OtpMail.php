<?php

namespace App\Mail;

use App\Models\Setting;
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
        return $this->subject(__('messages.auth.otp_mail_subject'))
            ->view('emails.otp')
            ->with([
                'otp' => $this->otp,
                'branding' => Setting::current(),
            ]);
    }
}
