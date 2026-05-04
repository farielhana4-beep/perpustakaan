<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
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
                'email' => 'Only members can reset password.',
            ]);
        }

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status !== Password::RESET_LINK_SENT) {
            return back()->withErrors([
                'email' => __($status),
            ]);
        }

        return back()->with('success', 'Reset link sent');
    }
}
