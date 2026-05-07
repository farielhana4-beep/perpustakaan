<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\OtpMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class PasswordResetLinkController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/ForgotPassword');
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::query()->where('email', $request->string('email')->toString())->first();

        if (! $user || $user->role !== 'member') {
            return back()->withErrors([
                'email' => __('messages.auth.member_only_reset'),
            ]);
        }

        $otp = random_int(100000, 999999);
        $now = now();
        $email = $request->string('email')->toString();

        DB::table('password_otps')->updateOrInsert(
            ['email' => $email],
            [
                'otp' => (string) $otp,
                'expires_at' => $now->copy()->addMinutes(5),
                'updated_at' => $now,
                'created_at' => $now,
            ]
        );

        Mail::to($email)->send(new OtpMail($otp));

        return redirect()
            ->route('password.reset', ['email' => $email])
            ->with('success', __('messages.auth.otp_sent'));
    }
}
