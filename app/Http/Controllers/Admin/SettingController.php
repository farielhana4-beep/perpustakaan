<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function edit()
    {
        return Inertia::render('Admin/Settings/Index', [
            'settings' => Setting::current(),
            'currencies' => ['IDR', 'USD', 'EUR'],
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'fine_per_day' => ['required', 'integer', 'min:0'],
            'max_borrow_days' => ['required', 'integer', 'min:1'],
            'currency' => ['required', 'string', 'max:10'],
            'max_books_per_user' => ['required', 'integer', 'min:1'],
        ]);

        Setting::current()->update($data);

        return back()->with('success', 'Settings saved');
    }
}
