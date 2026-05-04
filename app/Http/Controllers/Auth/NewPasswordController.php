<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Inertia\Inertia;

class NewPasswordController extends Controller
{
    public function create(Request $request)
    {
        return Inertia::render('Auth/ResetPassword', [
            'email' => $request->string('email')->toString(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'otp' => ['required', 'digits:6'],
            'password' => ['required', 'confirmed', PasswordRule::min(8)],
        ]);

        $email = $request->string('email')->toString();
        $user = User::query()->where('email', $email)->first();

        if (! $user || $user->role !== 'member') {
            return back()->withErrors([
                'email' => 'Password reset is only available for members.',
            ]);
        }

        $record = DB::table('password_otps')
            ->where('email', $email)
            ->where('otp', $request->string('otp')->toString())
            ->first();

        if (! $record || now()->gt(Carbon::parse($record->expires_at))) {
            return back()->withErrors([
                'otp' => 'Invalid or expired OTP',
            ]);
        }

        User::where('email', $email)
            ->update(['password' => Hash::make($request->string('password')->toString())]);

        DB::table('password_otps')->where('email', $email)->delete();

        return redirect()->route('login')->with('success', 'Password updated successfully.');
    }
}
