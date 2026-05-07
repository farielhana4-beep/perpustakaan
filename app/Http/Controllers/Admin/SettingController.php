<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Support\ImageStorage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function edit()
    {
        Gate::authorize('manage-branding');

        return Inertia::render('Admin/Settings/Index', [
            'settings' => Setting::current(),
            'currencies' => ['IDR', 'USD', 'EUR'],
            'locales' => [
                ['value' => 'id', 'label' => __('messages.locale.indonesian')],
                ['value' => 'en', 'label' => __('messages.locale.english')],
            ],
        ]);
    }

    public function update(Request $request)
    {
        Gate::authorize('manage-branding');

        $settings = Setting::current();

        $data = $request->validate([
            'library_name' => ['required', 'string', 'max:255'],
            'default_locale' => ['required', Rule::in(config('app.supported_locales', ['id', 'en']))],
            'fine_per_day' => ['required', 'integer', 'min:0'],
            'max_borrow_days' => ['required', 'integer', 'min:1'],
            'currency' => ['required', 'string', 'max:10'],
            'max_books_per_user' => ['required', 'integer', 'min:1'],
            'library_logo' => ['nullable', 'file', 'mimes:png,jpg,jpeg,webp,svg', 'max:4096'],
            'library_favicon' => ['nullable', 'file', 'mimes:ico,png,svg', 'max:2048'],
        ]);

        if ($request->hasFile('library_logo')) {
            $data['library_logo'] = ImageStorage::replace($settings->library_logo, $request->file('library_logo'), 'settings', 512);
        } else {
            unset($data['library_logo']);
        }

        if ($request->hasFile('library_favicon')) {
            $data['library_favicon'] = ImageStorage::replace($settings->library_favicon, $request->file('library_favicon'), 'settings', 256);
        } else {
            unset($data['library_favicon']);
        }

        $settings->update($data);

        return back()->with('success', __('messages.flash.settings_saved'));
    }
}
