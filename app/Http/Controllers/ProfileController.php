<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Support\ImageStorage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function edit(Request $request)
    {
        return Inertia::render('Profile/Edit', [
            'user' => $request->user(),
        ]);
    }

    public function update(Request $request)
    {
        /** @var User $user */
        $user = $request->user();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['nullable', 'string', 'max:255', Rule::unique('users', 'username')->ignore($user->id)],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'bio' => ['nullable', 'string', 'max:1000'],
        ]);

        $data['username'] = $data['username'] !== '' ? $data['username'] : null;
        $data['bio'] = $data['bio'] !== '' ? $data['bio'] : null;

        $user->update($data);

        return back()->with('success', __('messages.flash.profile_updated'));
    }

    public function password(Request $request)
    {
        /** @var User $user */
        $user = $request->user();

        $data = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        $user->update([
            'password' => Hash::make($data['password']),
        ]);

        return back()->with('success', __('messages.flash.password_changed'));
    }

    public function avatar(Request $request)
    {
        /** @var User $user */
        $user = $request->user();

        $data = $request->validate([
            'avatar' => ['required', 'file', 'mimes:png,jpg,jpeg,webp', 'max:4096'],
        ]);

        $user->update([
            'avatar_path' => ImageStorage::replace($user->avatar_path, $request->file('avatar'), 'profile', 512),
        ]);

        return back()->with('success', __('messages.flash.avatar_updated'));
    }

    public function removeAvatar(Request $request)
    {
        /** @var User $user */
        $user = $request->user();

        if ($user->avatar_path) {
            Storage::disk('public')->delete($user->avatar_path);
        }

        $user->update([
            'avatar_path' => null,
        ]);

        return back()->with('success', __('messages.flash.avatar_removed'));
    }
}
